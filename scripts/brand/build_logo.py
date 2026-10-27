#!/usr/bin/env python3
"""Rebuilds the Touchdown Wings badge from the best surviving source.

The only full-resolution copy of the artwork is the one printed on the hibachi
menu (src/assets/hibachi_menu.png, logo ~1070 px wide). The web mark that used
to ship (reference/tdw_logo_mark_180.png) is 180 px, clipped at the wing tips
and was cut out of a white background badly. This script:

  1. crops the print logo and registers the old web mark onto it, which tells
     us which enclosed sky pockets are background, and gives a colour target
     (the print is slightly washed out compared with the web palette)
  2. pulls a soft matte off the sky. Every outer edge of the art is a thick
     black outline, so coverage can be read straight from luminance against a
     locally estimated sky colour
  3. decontaminates edge colours against that sky, removes haze, fringe and
     specks
  4. writes variant A (dark backgrounds, halftone removed) and variant B
     (light backgrounds, halftone kept) at 240/480/720 px as PNG and WebP

Run:  scripts/brand/.tools/venv/bin/python scripts/brand/build_logo.py
Deps: scripts/brand/requirements.txt (venv lives in scripts/brand/.tools)
"""
from pathlib import Path
import sys

import cv2
import numpy as np
import oxipng
from PIL import Image
from scipy import ndimage as ndi
from skimage import measure, morphology

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SRC = ROOT / "src/assets/hibachi_menu.png"
REF = HERE / "reference/tdw_logo_mark_180.png"
OUT = ROOT / "src/assets/brand"
DEBUG = ROOT / ".logo-qa/build"

# left-hand logo on the print menu, x, y, w, h in source pixels. Starts below
# the photo strip's caption bar; the "P" of "Phone" on the right is dropped as
# a large stray component.
CROP = (103, 1705, 1276, 950)
WIDTHS = (240, 480, 720)
PAD = 0.04

# Thresholds are in source pixels; the source is ~6x the old 180 px mark.
DARK_L = 110          # outline / dot luminance ceiling
OUTLINE_L = 12        # luminance of the solid black outline
EDGE_BAND = 3         # px either side of the fg/bg boundary that get a soft matte
FRINGE_DIST = 5       # brief: 3 px at 4x, scaled to ~6x
HALFTONE_ZONE = 45    # how far from loose dots to look for fused ones
DOT_RADIUS = 16       # opening disc: larger than the biggest dot (r ~11) plus its overlap with the outline
OUTLINE_KEEP = 4      # outline kept around coloured art inside that zone


def lum(rgb):
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def save_debug(name, arr):
    DEBUG.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(DEBUG / name)


def on(rgba, bg):
    a = rgba[..., 3:4] / 255.0
    return rgba[..., :3] * a + np.array(bg, np.float32) * (1 - a)


# ---------------------------------------------------------------- register
def register(crop, ref):
    """Scale + translation that maps ref pixels onto crop pixels."""
    def edges(g):
        return cv2.GaussianBlur(cv2.Canny(g, 60, 150).astype(np.float32), (0, 0), 1.5)

    a = ref[..., 3:4] / 255.0
    flat = (ref[..., :3] * a + np.array([150, 190, 230]) * (1 - a)).astype(np.uint8)
    ref_e = edges(cv2.resize(cv2.cvtColor(flat, cv2.COLOR_RGB2GRAY), None, fx=2, fy=2,
                             interpolation=cv2.INTER_CUBIC))
    gray = cv2.cvtColor(crop.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    best = (-1, 0, (0, 0))
    for s in np.arange(5.4, 6.8, 0.01):
        small = cv2.resize(gray, None, fx=2 / s, fy=2 / s, interpolation=cv2.INTER_AREA)
        if small.shape[0] < ref_e.shape[0] or small.shape[1] < ref_e.shape[1]:
            continue
        _, v, _, loc = cv2.minMaxLoc(cv2.matchTemplate(edges(small), ref_e, cv2.TM_CCORR_NORMED))
        if v > best[0]:
            best = (v, s, loc)
    v, s, loc = best
    print(f"  registered reference: scale {s:.2f}, score {v:.3f}")
    if v < 0.8:
        sys.exit("  registration failed; check CROP")
    return np.float32([[s, 0, loc[0] * s / 2], [0, s, loc[1] * s / 2]])


def colour_fit(crop, ref, M):
    """Affine RGB map from print colours to the web palette, fitted on flat
    regions where both images are fully opaque art."""
    Minv = cv2.invertAffineTransform(M)
    small = cv2.warpAffine(cv2.GaussianBlur(crop, (0, 0), 3), Minv,
                           (ref.shape[1], ref.shape[0]), flags=cv2.INTER_AREA)
    solid = cv2.erode((ref[..., 3] >= 250).astype(np.uint8), np.ones((3, 3))) > 0
    g = cv2.cvtColor(ref[..., :3].astype(np.uint8), cv2.COLOR_RGB2GRAY)
    flat = cv2.morphologyEx(g, cv2.MORPH_GRADIENT, np.ones((3, 3))) < 25
    sel = solid & flat
    P = np.c_[small[sel], np.ones(sel.sum())]
    Q = ref[..., :3][sel]
    A, *_ = np.linalg.lstsq(P, Q, rcond=None)
    err = np.abs(P @ A - Q).mean()
    print(f"  colour fit on {sel.sum()} px, mean abs error {err:.1f}")
    return A


# ---------------------------------------------------------------- matte
def fill_background(rgb, known):
    """Sky colour everywhere, by normalised convolution of known sky pixels."""
    out = np.zeros_like(rgb)
    done = np.zeros(known.shape, bool)
    k = known.astype(np.float32)
    for sigma in (12, 30, 80, 200):
        w = cv2.GaussianBlur(k, (0, 0), sigma)
        c = cv2.GaussianBlur(rgb * k[..., None], (0, 0), sigma)
        ok = (w > 1e-3) & ~done
        out[ok] = c[ok] / w[ok, None]
        done |= ok
    return out


def matte(rgb, ref_alpha):
    L = lum(rgb)
    light = L >= DARK_L
    # 4-connectivity so the sky cannot leak through a diagonal gap in the outline
    lab, n = ndi.label(light)
    border = np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])
    bg = np.isin(lab, border[border > 0])
    # enclosed pockets: sky inside the silhouette (between wings and ball).
    # Sky in the old web mark is transparent, and sky is blue; gold feather
    # tips the web mark clipped are neither.
    idx = np.arange(1, n + 1)
    mean_ref = ndi.mean(ref_alpha, lab, idx)
    mean_b = ndi.mean(rgb[..., 2] - rgb[..., 0], lab, idx)
    pockets = idx[(mean_ref < 0.5) & (mean_b > 15)]
    bg |= np.isin(lab, pockets)
    fg = ~bg

    known = bg & (ndi.distance_transform_edt(bg) > 3)
    sky = fill_background(rgb, known)
    Lb = lum(sky)

    soft = np.clip((Lb - L) / np.maximum(Lb - OUTLINE_L, 1), 0, 1)
    d_in = ndi.distance_transform_edt(fg)
    d_out = ndi.distance_transform_edt(bg)
    alpha = np.where(fg, 1.0, 0.0)
    band = (fg & (d_in <= EDGE_BAND)) | (bg & (d_out <= EDGE_BAND))
    alpha[band] = soft[band]
    # small dark islands (halftone dots) are entirely edge: matte them fully
    dots = fg & (d_in <= EDGE_BAND + 3)
    lab_fg, _ = ndi.label(fg)
    sizes = np.bincount(lab_fg.ravel())
    small = sizes[lab_fg] < 400
    alpha[dots & small] = soft[dots & small]

    # 1. decontaminate: C = (C_obs - (1 - a) * B) / a
    a = alpha[..., None]
    col = np.where(a > 0, (rgb - (1 - a) * sky) / np.maximum(a, 1e-3), 0)
    col = np.clip(col, 0, 255)
    save_debug("01-regions.png", np.dstack([fg * 255, bg * 0, np.isin(lab, pockets) * 255]))
    save_debug("02-sky.png", sky)
    return col, alpha


def cleanup(col, alpha, canvas_px):
    # 2. haze
    alpha = np.where(alpha < 0.20, 0.0, alpha)
    # 3. fringe: near-white pixels hugging a fully transparent pixel. Legit
    # white (letters, laces) always sits inside a black outline.
    d = ndi.distance_transform_edt(alpha > 0)
    fringe = (col.min(-1) > 200) & (d <= FRINGE_DIST) & (alpha > 0)
    alpha[fringe] = 0
    # 4. light specks
    lab = measure.label(alpha > 0, connectivity=2)
    L = lum(col) / 255
    for r in measure.regionprops(lab, intensity_image=L):
        if r.area < 0.0005 * canvas_px and r.intensity_mean > 0.6:
            alpha[lab == r.label] = 0
    # anything that is neither the badge nor a dot near it (caption text etc.)
    lab = measure.label(alpha > 0, connectivity=2)
    props = sorted(measure.regionprops(lab), key=lambda r: -r.area)
    main = lab == props[0].label
    near = ndi.distance_transform_edt(~main) < 90
    for r in props[1:]:
        m = lab == r.label
        if r.area > 0.0015 * canvas_px or not (near & m).any():
            alpha[m] = 0
    return alpha, fringe.sum()


def remove_halftone(col, alpha, canvas_px):
    """Variant A: every small dark component other than the badge, then dots
    fused to the outline (dark bumps that a disc opening shaves off)."""
    L = lum(col) / 255
    lab = measure.label(alpha > 0, connectivity=2)
    props = sorted(measure.regionprops(lab, intensity_image=L), key=lambda r: -r.area)
    loose = np.zeros(alpha.shape, bool)
    for r in props[1:]:
        if r.area < 0.0015 * canvas_px and r.intensity_mean < 0.35:
            loose |= lab == r.label
    alpha[loose] = 0
    removed = int(loose.any() and measure.label(loose).max())

    # Fused dots live where the loose ones were. Inside that zone, shave the
    # silhouette with a disc opening, but never within a few px of coloured
    # art, so feather tips and letter outlines keep their shape.
    zone = ndi.distance_transform_edt(~loose) <= HALFTONE_ZONE
    solid = alpha > 0.5
    # every fill in the art (red, brown, blue, gold, white) is above 0.3;
    # outline and dots are below 0.2
    coloured = solid & (L > 0.27)
    protect = ndi.distance_transform_edt(~coloured) <= OUTLINE_KEEP
    opened = morphology.opening(solid, morphology.disk(DOT_RADIUS))
    keep = ndi.binary_dilation(opened | protect, iterations=1)
    cut = zone & (alpha > 0) & ~keep
    alpha[cut] = 0
    # re-take the largest component so cut-off dust disappears
    lab = measure.label(alpha > 0, connectivity=2)
    props = sorted(measure.regionprops(lab), key=lambda r: -r.area)
    alpha[(lab != props[0].label) & (lab > 0)] = 0
    return alpha, removed


# ---------------------------------------------------------------- export
def trim_pad(col, alpha):
    ys, xs = np.nonzero(alpha > 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    edge_hits = [n for n, v in (("top", y0), ("left", x0)) if v == 0] + \
                [n for n, v in (("bottom", y1), ("right", x1)) if v == alpha.shape[0 if n == "bottom" else 1]]
    col, alpha = col[y0:y1, x0:x1], alpha[y0:y1, x0:x1]
    h, w = alpha.shape
    px, py = round(PAD * w), round(PAD * h)
    C = np.zeros((h + 2 * py, w + 2 * px, 3), np.float32)
    A = np.zeros((h + 2 * py, w + 2 * px), np.float32)
    C[py:py + h, px:px + w], A[py:py + h, px:px + w] = col, alpha
    return C, A, edge_hits


def resize_premul(col, alpha, width):
    h = round(alpha.shape[0] * width / alpha.shape[1])
    pre = np.dstack([col * alpha[..., None], alpha * 255]).astype(np.float32)
    # area-average down in linear-ish premultiplied space, then a light
    # unsharp: the print source is soft
    small = cv2.resize(pre, (width, h), interpolation=cv2.INTER_AREA)
    blur = cv2.GaussianBlur(small, (0, 0), 0.8)
    small = np.clip(small + 0.45 * (small - blur), 0, None)
    a = np.clip(small[..., 3], 0, 255)
    c = np.where(a[..., None] > 0, small[..., :3] / np.maximum(a[..., None], 1e-3) * 255, 0)
    c = np.minimum(c, 255)
    return np.dstack([c, a]).round().astype(np.uint8)


def export(name, col, alpha):
    OUT.mkdir(parents=True, exist_ok=True)
    out = {}
    for w in WIDTHS:
        rgba = resize_premul(col, alpha, w)
        rgba[rgba[..., 3] == 0, :3] = 0
        im = Image.fromarray(rgba, "RGBA")
        png = OUT / f"{name}-{w}.png"
        im.save(png)
        oxipng.optimize(png, level=6, strip=oxipng.StripChunks.safe())
        webp = OUT / f"{name}-{w}.webp"
        im.save(webp, "WEBP", quality=90, alpha_quality=100, method=6)
        out[w] = (rgba.shape[1], rgba.shape[0], png.stat().st_size, webp.stat().st_size)
    return out


def main():
    src = Image.open(SRC).convert("RGB")
    x, y, w, h = CROP
    crop = np.asarray(src.crop((x, y, x + w, y + h)), np.float32)
    ref = np.asarray(Image.open(REF).convert("RGBA"), np.float32)

    M = register(crop, ref)
    ref_alpha = cv2.warpAffine(ref[..., 3] / 255, M, (w, h), flags=cv2.INTER_LINEAR)
    A = colour_fit(crop, ref, M)

    col, alpha = matte(crop, ref_alpha)
    col = np.clip(np.c_[col.reshape(-1, 3), np.ones(col.shape[0] * col.shape[1])] @ A,
                  0, 255).reshape(col.shape).astype(np.float32)
    canvas = w * h
    alpha, n_fringe = cleanup(col, alpha, canvas)
    print(f"  fringe pixels removed: {n_fringe}")

    variants = {"tdw-badge-light": alpha.copy()}
    a_dark, n_dots = remove_halftone(col, alpha.copy(), canvas)
    variants["tdw-badge-dark"] = a_dark
    print(f"  halftone pieces removed for dark variant: {n_dots}")

    for name, a in variants.items():
        C, Al, hits = trim_pad(col, a)
        rgba = np.dstack([C, Al * 255])
        save_debug(f"{name}-full.png", rgba)
        save_debug(f"{name}-on-navy.png", on(rgba, (11, 20, 36)))
        save_debug(f"{name}-on-paper.png", on(rgba, (237, 227, 207)))
        if hits:
            print(f"  NOTE {name}: art touches the source crop at {hits} (clipped at source)")
        for wpx, (ow, oh, ps, ws) in export(name, C, Al).items():
            print(f"  {name}-{wpx}: {ow}x{oh}  png {ps/1024:.1f} kB  webp {ws/1024:.1f} kB")


if __name__ == "__main__":
    main()

// ═════════════════════════════════════════════════════════════
//  SITE SETTINGS
//  Hours, sudden closings, and contact details all live here.
//  Edit the values, save, and the whole site updates.
//
//  Rules that apply everywhere in this file:
//    • Anything inside "quotes" is text. Keep the quotes.
//    • Keep the comma at the end of each line.
//    • Lines starting with // are notes and are ignored.
// ═════════════════════════════════════════════════════════════


// ── SUDDEN CLOSINGS ──────────────────────────────────────────
//  TO CLOSE THE RESTAURANT RIGHT NOW:
//    1. change isActive to  true
//    2. write what you want customers to read in message
//    3. save, then run:  npm run deploy
//
//  While isActive is true:
//    • a yellow banner appears at the top of every page
//    • the status reads CLOSED everywhere (top bar, scoreboard)
//      no matter what the hours below say
//
//  TO REOPEN: change isActive back to  false  and deploy again.
//  You can leave the old message sitting there — it is hidden
//  whenever isActive is false.
//
//  true and false are NOT in quotes. message IS in quotes.
export const specialClosure = {
  isActive: false,
  message: "Closed Sun., June 14 - Thurs., June 18. We reopen Friday the 19th.",
};


// ── HOURS ────────────────────────────────────────────────────
//  This is the only place hours are written down. The open/closed
//  badge, the scoreboard, the list in the header, and the list in
//  the footer all read from here, so they can never disagree.
//
//  HOW TO WRITE A TIME
//  Use the 24-hour clock, with minutes as a decimal:
//
//      11      = 11:00 am          17      =  5:00 pm
//      11.25   = 11:15 am          20      =  8:00 pm
//      11.5    = 11:30 am          20.5    =  8:30 pm
//      12      = 12:00 noon        21      =  9:00 pm
//      12.75   = 12:45 pm          21.5    =  9:30 pm
//
//  Quick conversion for the minutes:
//      :15 = .25      :30 = .5      :45 = .75
//      :10 = .166     :20 = .333    :40 = .666
//
//  CLOSED ALL DAY: write  null  (no quotes), like monday below.
//
//  EXAMPLES
//    Open 11am to 9pm:        { open: 11, close: 21 },
//    Open noon to 8:30pm:     { open: 12, close: 20.5 },
//    Closed:                  null,
//
//  NOTES
//  • Times are Central Time. That is set by timeZone further down.
//  • close must be LATER than open. Closing after midnight (say
//    11am–1am) is not supported — the site would read it as closed
//    all day. Tell me if you ever need late nights.
//  • Days that share the same hours are automatically grouped in
//    the display, e.g. "Tue – Thu  11am – 8:30pm". You do not do
//    anything for that; just set each day correctly.
export const hours = {
  sunday:    { open: 12, close: 20 },
  monday:    null,
  tuesday:   { open: 11, close: 20.5 },
  wednesday: { open: 11, close: 20.5 },
  thursday:  { open: 11, close: 20.5 },
  friday:    { open: 11, close: 21 },
  saturday:  { open: 11, close: 21 },
};


// ── CONTACT ──────────────────────────────────────────────────
//  Change the phone number or address in ONE place below and
//  everything follows: the number shown in the top bar and the
//  footer, the tap-to-call button, and the Directions link.
const PHONE = "(931) 913-2888";
const STREET = "1408 N Jackson St.";
const CITY_STATE_ZIP = "Tullahoma, TN 37388";

export const restaurant = {
  name: "Touchdown Wings",

  // Used by the search-engine listing. Must match the live address.
  siteUrl: "https://touchdownwingstullahoma.com",

  phone: PHONE,
  street: STREET,
  cityStateZip: CITY_STATE_ZIP,

  // Timezone the hours above are written in. Leave this alone
  // unless the restaurant physically moves to another zone.
  timeZone: "America/Chicago",

  // ↓ Built from the three values above. Nothing to edit here —
  //   this is what stops the displayed number and the dial button
  //   from drifting apart.
  phoneHref: `tel:+1${PHONE.replace(/\D/g, "")}`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${STREET} ${CITY_STATE_ZIP}`
  )}`,
};


// ── DELIVERY ─────────────────────────────────────────────────
//  We take orders by phone; DoorDash handles delivery. This is
//  mentioned as a line of text, not a big delivery button, so the
//  phone stays the main call to action.
//
//  Leave url as "" and it shows as plain text. Paste your DoorDash
//  store link and the words become a link instead.
//  Set enabled to false to stop mentioning it at all.
export const doorDash = {
  enabled: true,
  url: "https://www.doordash.com/store/touchdown-wings-tullahoma-1408-n-jackson-st-tullahoma-33986273/64427546/",
};

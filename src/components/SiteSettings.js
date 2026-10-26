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


// ── CLOSURE NOTICE ───────────────────────────────────────────
//  A gold banner at the top of the page. Two ways to run it.
//
//  MANUAL — show it now, hide it when you are done.
//      mode: "manual", isActive: true
//    Write your own headline (and an optional second line). No
//    dates needed. This is the one to use for anything sudden.
//
//  SCHEDULED — show it only between two dates, then stop on its own.
//      mode: "scheduled", isActive: true, from / to set
//    Leave headline and message empty and the wording is written
//    from the dates for you.
//
//  SHOWING A NOTICE AND BEING CLOSED ARE SEPARATE.
//    closesRestaurant: true   we are shut — status reads CLOSED
//                             everywhere and the countdown stops
//    closesRestaurant: false  just an announcement — today's hours
//                             carry on as normal
//  So you can warn about next week's closure while open today.
//
//  ── EXAMPLES ────────────────────────────────────────────────
//
//  1. An announcement, visible right now, still open today:
//        mode: "manual", isActive: true, closesRestaurant: false,
//        headline: "Closed next Monday for a private event",
//        message:  "Open as usual the rest of the week.",
//
//  2. Shut right now, in your own words:
//        mode: "manual", isActive: true, closesRestaurant: true,
//        headline: "Closed today — burst pipe",
//        message:  "Back tomorrow at 11am.",
//
//  3. A booked week off, wording written for you:
//        mode: "scheduled", isActive: true, closesRestaurant: true,
//        from: "2026-06-14", to: "2026-06-18", reopenTime: 11,
//        headline: "", message: "",
//        → "Closed June 14-18" / "Reopening Friday, June 19 at 11am"
//
//  4. Same dates, your own words:
//        mode: "scheduled", isActive: true, closesRestaurant: true,
//        from: "2026-06-14", to: "2026-06-18",
//        headline: "Closed for the Smith family reunion",
//        message:  "See you Friday!",
//
//  Your wording never changes the schedule — dates come only from
//  from / to, never from the text.
//
//  TO PREVIEW a scheduled notice outside its dates: run npm start
//  and add  ?preview-notice  to the address. That works only on
//  your machine; it does nothing on the live site.
export const specialClosure = {
  mode: "manual",

  // the master switch — nothing shows while this is false
  isActive: false,

  // are we actually shut, or just announcing something?
  closesRestaurant: true,

  // your own wording. Required in manual mode. In scheduled mode,
  // leave both "" to have the dates written out for you.
  headline: "Closed from Tues, June 11 to Wed., June 12",
  message: "Reopening on 11am Thurs., June 13",

  // scheduled mode only. Both days are INCLUDED; for a single day
  // put the same date in both. Dates are "YYYY-MM-DD".
  from: "2026-11-14",
  to: "2026-11-18",

  // the time you open again on the first day back, in the same
  // 24-hour decimals as the hours below (11 = 11am, 20.5 = 8:30pm).
  // Leave null if it is not confirmed — only the date is shown then.
  reopenTime: null,
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

  // ↓ Built from the values above. Nothing to edit here — this is what
  //   stops the displayed number and the dial button from drifting apart.
  phoneHref: `tel:+1${PHONE.replace(/\D/g, "")}`,

  // Opens Google Maps with the destination already set, so a customer gets
  // a route rather than a business listing they have to tap again. The
  // starting point is left blank on purpose — Maps fills in their location.
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `Touchdown Wings, ${STREET}, ${CITY_STATE_ZIP}`
  )}`,
};


// ── TELLING THIS LOCATION APART ──────────────────────────────
//  "Touchdown Wings" is not a unique name, so search engines need
//  help tying this website to THIS restaurant. Filling these in is
//  the strongest signal you can send from the site itself.
export const identity = {
  // Every other place this exact restaurant is listed. Paste the full
  // URLs — Google uses them to confirm the website and the listing are
  // the same business. The Google Business Profile link matters most.
  //
  //   Google Business Profile: open your profile -> Share -> copy link
  //   Facebook page, Yelp page, Instagram, TripAdvisor...
  //
  // Example:
  //   profiles: [
  //     "https://www.facebook.com/yourpage",
  //     "https://www.yelp.com/biz/your-listing",
  //   ],
  profiles: [],

  // Exact coordinates pin the listing to this address rather than a
  // same-named restaurant elsewhere.
  //   In Google Maps: right-click the restaurant -> click the numbers
  //   at the top of the menu to copy them -> paste below.
  // Leave both null and they are simply left out.
  latitude: 35.3759619,
  longitude: -86.2236379,
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

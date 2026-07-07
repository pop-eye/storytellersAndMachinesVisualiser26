/* ============================================================
   STORYTELLERS + MACHINES 2026 — FEEDBACK DATA
   ------------------------------------------------------------
   This is the ONLY file you need to edit to populate the site.

   SAMPLE_MODE: while true, the sample entries below are shown
   and every board carries a "SAMPLE DATA" flag. Set it to false
   once real transcriptions are in — any board left empty then
   shows an "awaiting transcription" state instead.

   Photos of the physical boards go in /photos and are listed
   in each board's `photos` array (they appear as a strip at
   the bottom of that board's page).
   ============================================================ */

const SAMPLE_MODE = true;

const DATA = {

  /* ---- 1. What is your relationship status with AI? ---------
     Simple tallies. Count the marks on the board per option.  */
  status: {
    photos: [],           // e.g. [{ src: "photos/status-01.jpg", caption: "Board, day 2" }]
    votes: {
      "We never dated": 4,
      "Happily together": 7,
      "It's complicated": 15,
      "We broke up": 5
    }
  },

  /* ---- 2. Plot your creative AI journey ---------------------
     One entry per drawn line.
     points: [x, y] pairs; x is 0–100 (first encounter → now),
     y is -100 (sceptical) to 100 (excited).
     turningPoints: optional labels at a position on the line. */
  journey: {
    photos: [],
    lines: [
      {
        label: "Attendee 01",
        points: [[0, 60], [20, 85], [45, 30], [70, -40], [100, -10]],
        turningPoints: [
          { x: 20, y: 85, text: "First Midjourney render" },
          { x: 70, y: -40, text: "Client asked for 'AI style'" }
        ]
      },
      {
        label: "Attendee 02",
        points: [[0, -30], [30, -50], [55, 10], [80, 45], [100, 55]],
        turningPoints: [{ x: 55, y: 10, text: "Used it for tedious rotoscoping" }]
      },
      {
        label: "Attendee 03",
        points: [[0, 90], [25, 70], [50, -70], [75, -80], [100, -85]],
        turningPoints: [{ x: 50, y: -70, text: "Training data headlines" }]
      },
      {
        label: "Attendee 04",
        points: [[0, 10], [40, 15], [70, 20], [100, 5]],
        turningPoints: []
      }
    ]
  },

  /* ---- 3. If creative AI disappeared tomorrow... ------------ */
  celebrateMiss: {
    photos: [],
    celebrate: [
      "The end of infinite beige concept art",
      "Commissions coming back to illustrators",
      "Not having to say 'no, a real photo' to clients",
      "Silence from the hype cycle"
    ],
    miss: [
      "Instant rough drafts at 2am",
      "Subtitling and translation for free",
      "Code that explains itself",
      "A sketch partner that never gets tired"
    ]
  },

  /* ---- 4. Write an obituary for creative AI ----------------- */
  obituaries: {
    photos: [],
    entries: [
      {
        lede: "Creative AI, 2022–2027.",
        text: "Died peacefully in its sleep after a long battle with diminishing returns. It is survived by a million half-finished side projects and one very tired GPU. In lieu of flowers, please pay an illustrator.",
        author: "Anonymous, day 1"
      },
      {
        lede: "In loving memory of The Prompt.",
        text: "It promised us everything and delivered a picture of a hand with seven fingers. It taught us, in the end, what we actually valued — which was each other. Donations to your local life-drawing class.",
        author: "Post-it, main foyer"
      }
    ]
  },

  /* ---- 5. Design the third way -------------------------------
     type: "postit" (yellow) or "written" (drawn/written direct
     on the board). ---------------------------------------------*/
  thirdWay: {
    photos: [],
    entries: [
      { type: "postit", text: "Slow AI: models trained only on work that's freely given, running on renewables, used once a week like a farmers' market." },
      { type: "written", text: "Tools that show their sources by default — provenance as a feature, not a lawsuit." },
      { type: "postit", text: "AI as instrument, not oracle. You still have to learn to play it." },
      { type: "postit", text: "Community-owned models. If it trains on Manchester, Manchester owns it." }
    ]
  },

  /* ---- 6. What should replace AI in your creative workflow? --
     Same idea written more than once? Bump `count` instead of
     duplicating — cards grow with recurrence. ------------------*/
  replace: {
    photos: [],
    entries: [
      { text: "Boredom", count: 6 },
      { text: "A sketchbook", count: 4 },
      { text: "Talking to other humans", count: 3 },
      { text: "Deadlines", count: 2 },
      { text: "A long walk", count: 2 },
      { text: "Nothing — keep it", count: 1 },
      { text: "The library", count: 1 }
    ]
  },

  /* ---- 7. What have you stopped using AI for and why? ------- */
  stopped: {
    photos: [],
    entries: [
      { what: "Writing first drafts", why: "they all sounded like the same person" },
      { what: "Generating reference images", why: "started warping my own taste" },
      { what: "Email", why: "people could tell" },
      { what: "Music recommendations", why: "it kept me in a loop of things I already liked" }
    ]
  },

  /* ---- 8. The end of AI means the beginning of... ------------ */
  beginning: {
    photos: [],
    entries: [
      "the archive",
      "slower software",
      "apprenticeships again",
      "cheaper electricity",
      "art with fingerprints on it",
      "the next hype cycle, probably"
    ]
  },

  /* ---- 9. Draw the ecological footprint of your practice -----
     These are drawings, so each entry is a cropped photo. ------*/
  eco: {
    photos: [],
    entries: [
      // { src: "photos/eco-01.jpg", caption: "A server farm drawn as a coal mine" },
      // { src: "photos/eco-02.jpg", caption: "Footprint made of tiny prompts" }
    ]
  }
};

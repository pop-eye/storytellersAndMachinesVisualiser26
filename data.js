/* ============================================================
   STORYTELLERS + MACHINES 2026 — FEEDBACK DATA
   ------------------------------------------------------------
   This is the ONLY file you need to edit to populate the site.

   SAMPLE_MODE: while true, sample entries are shown and every
   board carries a "SAMPLE DATA" flag. Now false — the entries
   below are transcribed from photographs of the real boards.
   Any board left empty shows an "awaiting transcription" state.

   Photos of the physical boards go in /photos and are listed
   in each board's `photos` array (they appear as a strip at
   the bottom of that board's page).
   ============================================================ */

const SAMPLE_MODE = false;

const DATA = {

  /* ---- 1. What is your relationship status with AI? ---------
     Heart stickers counted from the board photo; the two written
     speech bubbles ("FWB!" and "promiscuous intercourse with
     multiple AI models") are included in It's complicated. ---- */
  status: {
    photos: [],           // e.g. [{ src: "photos/status-01.jpg", caption: "Board, day 2" }]
    votes: {
      "We never dated": 3,
      "Happily together": 7,
      "It's complicated": 11,
      "We broke up": 3
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
        label: "Red pen — rollercoaster",
        points: [[0, -5], [3, 95], [10, -70], [22, -80], [38, -15], [46, 35], [54, -45], [70, -55], [88, 25], [97, 90]],
        turningPoints: []
      },
      {
        label: "Green pen — long climb",
        points: [[0, -85], [20, -55], [40, -25], [60, 10], [80, 50], [100, 95]],
        turningPoints: [
          { x: 92, y: 78, text: "“I want to know who this is and hear their story please” — asks Phoebe" }
        ]
      },
      {
        label: "Green pen — out at 1 year",
        points: [[0, -80], [8, -30], [13, 25], [17, -20], [22, 30], [28, -25], [36, 10], [43, -20], [48, -75]],
        turningPoints: []
      },
      {
        label: "Purple pen — the big hump",
        points: [[0, -55], [20, -45], [40, 10], [57, 45], [72, 15], [88, -40], [100, -90]],
        turningPoints: []
      },
      {
        label: "Purple pen — flat since 1997",
        points: [[0, 15], [11, 15], [13, 25], [15, 15], [41, 15], [43, 25], [45, 15], [71, 15], [73, 25], [75, 15], [100, 13]],
        turningPoints: [{ x: 2, y: 15, text: "1997" }]
      },
      {
        label: "Purple pen — never bought in",
        points: [[0, -92], [12, -86], [25, -92], [38, -88], [55, -94], [75, -97], [100, -96]],
        turningPoints: []
      }
    ]
  },

  /* ---- 3. If creative AI disappeared tomorrow... ------------
     A couple of notes were hard to read on the photo — marked
     with (?) where a word is uncertain. ------------------------*/
  celebrateMiss: {
    photos: [],
    celebrate: [
      "Discovery through craft, iteration & mistakes from chance encounters",
      "MADE BY HUMAN — with all our welcome idiosyncrasies",
      "Less Insta deepfake/bullshit",
      "It being slightly easier to distinguish truth from lies on social media",
      "Benefit to education",
      "End of exploitation of people (?)",
      "Being able to tell authentic and hard-working creators apart from grifters",
      "The chance to give attention (?) to anything else…"
    ],
    miss: [
      "Ease of use of new tools",
      "Instant answers",
      "The comedy of the nonsense in Google “AI Summary”",
      "Possibilities of leisure",
      "The exaggerated random ugly images it can generate",
      "The conversation of possibilities it provided"
    ]
  },

  /* ---- 4. Write an obituary for creative AI ----------------- */
  obituaries: {
    photos: [],
    entries: []
  },

  /* ---- 5. Design the third way -------------------------------
     type: "postit" (yellow) or "written" (drawn/written direct
     on the board). ---------------------------------------------*/
  thirdWay: {
    photos: [],
    entries: []
  },

  /* ---- 6. What should replace AI in your creative workflow? --
     Same idea written more than once? Bump `count` instead of
     duplicating — cards grow with recurrence. ------------------*/
  replace: {
    photos: [],
    entries: []
  },

  /* ---- 7. What have you stopped using AI for and why? ------- */
  stopped: {
    photos: [],
    entries: []
  },

  /* ---- 8. The end of AI means the beginning of... ------------ */
  beginning: {
    photos: [],
    entries: [
      "PYRAMID ACTIVATION",
      "THINKING",
      "now",
      "HUMANITY",
      "blue-sky autonomy outside of data economies",
      "the Oracle ♥",
      "the revolution (as if…)",
      "A.I. LeBrand",
      "a luddite-revolution",
      "Tech World"
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

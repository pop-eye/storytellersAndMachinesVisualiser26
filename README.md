# The Feedback Terminal
### Storytellers + Machines 2026 — audience board visualiser

A static site that presents the nine "End of AI" A1 feedback boards from the conference as themed, navigable visualisers. No build step, no dependencies — plain HTML/CSS/JS.

## The boards

| # | Board | Visualiser |
|---|-------|-----------|
| 01 | Relationship status with AI | Dot-matrix poll — one pixel per vote |
| 02 | Plot your creative AI journey | Overlaid oscilloscope lines with hoverable turning points |
| 03 | Disappeared tomorrow: celebrate / miss | Split wall with balance meter |
| 04 | Obituary for creative AI | Newspaper in-memoriam column |
| 05 | Design the third way | Post-it wall |
| 06 | What should replace AI | Ballot cards sized by recurrence |
| 07 | Stopped using AI for… | Software deprecation log |
| 08 | The beginning of… | Typewriter cycle + full list |
| 09 | Ecological footprint drawings | Photo gallery with lightbox |

## Presenting to a room

Open the site fullscreen (F11) on a 16:9 screen and it switches into **presentation mode** automatically: the header and navigation compact, scrolling is eliminated (a board that runs long is scaled down to fit), faint CRT scanlines appear, and a keyboard hint shows in the footer.

- **← / →** — step between boards
- **A** — autoplay: advance to the next board every 20 seconds (a ▶ AUTO badge shows while it's on)
- **P** — force presentation mode on/off at any window size

For an unattended screen, add **`?kiosk`** to the URL (e.g. `…/index.html?kiosk#/status`): presentation mode and autoplay start by themselves — open it, hit F11, walk away.

Elements animate in as each board loads — the END OF A.I. masthead glitches for a beat on every board change, poll pixels pop in one by one while their tallies count up from zero, the journey traces draw themselves on like an oscilloscope sweep, post-its land with a stagger, board photos print on row by row like a dot-matrix printer, and the deprecation log prints line by line. All animation respects the visitor's reduced-motion preference.

## Deploying to GitHub Pages

Deployment is automated: every push to `main` runs the workflow in `.github/workflows/deploy-pages.yml`, which enables GitHub Pages on first run and publishes the site to

```
https://pop-eye.github.io/storytellersAndMachinesVisualiser26/
```

Updating content later is just a commit: edit `data.js`, drop images in `photos/`, push to `main`.

If the first workflow run can't enable Pages itself (organisation permission settings vary), enable it once by hand: **Settings → Pages → Source: GitHub Actions**, then re-run the workflow from the Actions tab.

## Populating with real responses

Everything lives in **`data.js`**:

1. Photograph each filled board (straight-on, good light — phone is fine).
2. Have the responses transcribed into the structures in `data.js` — each board's section has a comment explaining its shape. (Sharing the photos with Claude and asking for the `data.js` entries works well.)
3. Put board photos and cropped drawings in `photos/`, and reference them in each board's `photos` array (they appear as a "physical board" strip) or, for board 09, in `eco.entries`.
4. Set `SAMPLE_MODE = false` at the top of `data.js`. The placeholder entries can then be deleted; any board left empty shows an "awaiting transcription" state.

### Journey lines (board 02)

Each drawn line becomes:

```js
{
  label: "Attendee 05",
  points: [[0, 40], [30, 80], [60, -20], [100, 10]],  // [x 0–100, y -100–100]
  turningPoints: [{ x: 30, y: 80, text: "What they wrote at that point" }]
}
```

x runs left-to-right (first encounter → now); y runs bottom-to-top (sceptical −100 → excited +100). Four to six points per line is usually enough to capture the shape.

## Local preview

Just open `index.html` in a browser, or run `python3 -m http.server` in the folder.

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

## Deploying to GitHub Pages

1. Create a new repository (e.g. `sm-feedback-terminal`) on GitHub.
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Feedback terminal"
   git branch -M main
   git remote add origin git@github.com:YOUR-USER/sm-feedback-terminal.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. The site appears at `https://YOUR-USER.github.io/sm-feedback-terminal/` within a minute or two.

Updating content later is just a commit: edit `data.js`, drop images in `photos/`, push.

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

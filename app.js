/* ============================================================
   THE FEEDBACK TERMINAL — app logic
   Vanilla JS, hash-routed, no build step. GitHub Pages ready.
   ============================================================ */

const BOARDS = [
  { id: "status",    num: "01", title: "What is your relationship status with AI?", prompt: "One mark per attendee against four options.", render: renderStatus,   count: d => Object.values(d.status.votes).reduce((a, b) => a + b, 0) },
  { id: "journey",   num: "02", title: "Plot your creative AI journey",             prompt: "A line from first encounter to now — excitement up, scepticism down. Hover a line or its markers to read the turning points.", render: renderJourney, count: d => d.journey.lines.length },
  { id: "celebrate", num: "03", title: "If creative AI disappeared tomorrow…",      prompt: "What would you celebrate? What would you miss?", render: renderCelebrate, count: d => d.celebrateMiss.celebrate.length + d.celebrateMiss.miss.length },
  { id: "obituary",  num: "04", title: "Write an obituary for creative AI",         prompt: "As printed in the papers.", render: renderObituary, count: d => d.obituaries.entries.length },
  { id: "thirdway",  num: "05", title: "Design the third way",                      prompt: "If the options are reject creative AI or fully embrace it — what's the alternative?", render: renderThirdWay, count: d => d.thirdWay.entries.length },
  { id: "replace",   num: "06", title: "What should replace AI in your creative workflow?", prompt: "Cards grow when the same answer came up more than once.", render: renderReplace, count: d => d.replace.entries.reduce((a, e) => a + (e.count || 1), 0) },
  { id: "stopped",   num: "07", title: "What have you stopped using AI for, and why?", prompt: "Logged here as formal deprecation notices.", render: renderStopped, count: d => d.stopped.entries.length },
  { id: "beginning", num: "08", title: "The end of AI means the beginning of…",     prompt: "Completions from the board.", render: renderBeginning, count: d => d.beginning.entries.length },
  { id: "eco",       num: "09", title: "Draw the ecological footprint of your creative practice", prompt: "Drawings from the board — click to enlarge.", render: renderEco, count: d => d.eco.entries.length }
];

const app = document.getElementById("app");
const nav = document.getElementById("board-nav");

/* ---------- helpers ---------- */
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function sampleFlag(parent) {
  if (SAMPLE_MODE) parent.appendChild(el("span", "sample-flag", "░ SAMPLE DATA — REAL RESPONSES TO FOLLOW ░"));
}
/* staggered entrance: nth element starts its rise animation a beat later */
function stag(node, i, step = 0.05) {
  node.style.animationDelay = `${(i * step).toFixed(3)}s`;
  return node;
}
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* tick a number up from zero, in step with the poll dots popping in */
function countUp(node, n, stepMs = 30) {
  if (REDUCED_MOTION || n < 1) { node.textContent = n; return; }
  node.textContent = 0;
  let c = 0;
  const t = setInterval(() => {
    if (!document.body.contains(node)) { clearInterval(t); return; }
    node.textContent = ++c;
    if (c >= n) clearInterval(t);
  }, stepMs);
}
function emptyState(parent, thing) {
  const d = el("div", "empty-state");
  d.appendChild(el("span", "no-signal", "NO SIGNAL"));
  d.appendChild(el("p", null, `No ${thing} transcribed yet. Once the boards are photographed and read, responses will appear here.`));
  parent.appendChild(d);
}
function photoStrip(parent, photos) {
  if (!photos || !photos.length) return;
  parent.appendChild(el("span", "strip-label", "░ THE PHYSICAL BOARD ░"));
  const strip = el("div", "photo-strip");
  photos.forEach((p, i) => {
    const f = stag(el("figure"), i);
    f.innerHTML = `<img src="${esc(p.src)}" alt="${esc(p.caption || "Photo of the board")}" loading="lazy"><figcaption>${esc(p.caption || "")}</figcaption>`;
    f.addEventListener("click", () => openLightbox(p.src, p.caption));
    strip.appendChild(f);
  });
  parent.appendChild(strip);
}

/* ---------- ticker ---------- */
(function buildTicker() {
  const phrases = ["THE END OF A.I.", "THE BEGINNING OF…", "STORYTELLERS + MACHINES 2026", "SODA · MANCHESTER", "FEEDBACK RECEIVED ▓▓░░"];
  const track = document.getElementById("ticker-track");
  const seq = phrases.map(p => `<span>${p}</span>`).join("·");
  track.innerHTML = seq + "·" + seq; // duplicated for seamless loop
})();

/* ---------- nav ---------- */
(function buildNav() {
  BOARDS.forEach(b => {
    const a = el("a", null, `${b.num}`);
    a.href = `#/${b.id}`;
    a.title = b.title;
    a.setAttribute("aria-label", `Board ${b.num}: ${b.title}`);
    nav.appendChild(a);
  });
  const all = el("a", null, "INDEX");
  all.href = "#/";
  nav.prepend(all);
})();

/* ---------- router ---------- */
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const board = BOARDS.find(b => b.id === hash);
  nav.querySelectorAll("a").forEach(a => a.classList.toggle("active",
    a.getAttribute("href") === (board ? `#/${board.id}` : "#/")));
  app.innerHTML = "";
  const view = el("div", "view");
  if (board) {
    renderBoardChrome(view, board);
  } else {
    renderHome(view);
  }
  app.appendChild(view);
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  requestAnimationFrame(fitView);
  glitchMasthead();
}

/* the END OF A.I. masthead flickers for a beat on every board change */
function glitchMasthead() {
  const mm = document.querySelector(".masthead-main");
  if (!mm || REDUCED_MOTION) return;
  mm.classList.remove("glitch");
  void mm.offsetWidth; // restart the animation
  mm.classList.add("glitch");
  clearTimeout(glitchMasthead.t);
  glitchMasthead.t = setTimeout(() => mm.classList.remove("glitch"), 400);
}
window.addEventListener("hashchange", route);

/* keyboard: ← → between boards · A autoplay · P presentation mode */
window.addEventListener("keydown", e => {
  if (e.target.matches("input, textarea")) return;
  const key = e.key.toLowerCase();
  if (key === "a") { setAutoplay(!autoTimer); return; }
  if (key === "p") { togglePresenting(); return; }
  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
  const hash = location.hash.replace(/^#\/?/, "");
  const i = BOARDS.findIndex(b => b.id === hash);
  if (e.key === "ArrowRight") location.hash = `#/${BOARDS[(i + 1 + BOARDS.length) % BOARDS.length].id}`;
  if (e.key === "ArrowLeft") location.hash = `#/${BOARDS[(i - 1 + BOARDS.length) % BOARDS.length].id}`;
  if (autoTimer) setAutoplay(true); // manual step restarts the autoplay clock
});

/* ---------- presentation mode ----------
   On wide landscape screens (fullscreen 16:9 projection) the page
   chrome compacts into a fixed full-height layout and each view is
   scaled down, if needed, so nothing ever scrolls. Auto-detected
   via media query; the P key forces it on/off. */
const presentMQ = window.matchMedia("(min-width: 1100px) and (min-aspect-ratio: 3/2)");
let presentOverride = null; // null = follow media query

function presentingNow() {
  return presentOverride === null ? presentMQ.matches : presentOverride;
}
function applyPresenting() {
  document.documentElement.classList.toggle("presenting", presentingNow());
  fitView();
}
function togglePresenting() {
  presentOverride = !presentingNow();
  if (presentOverride === presentMQ.matches) presentOverride = null; // back in step → follow auto again
  applyPresenting();
}
presentMQ.addEventListener("change", applyPresenting);

function fitView() {
  const view = app.querySelector(".view");
  if (!view) return;
  view.style.transform = "";
  view.style.width = "";
  view.style.transformOrigin = "";
  if (!document.documentElement.classList.contains("presenting")) return;
  const cs = getComputedStyle(app);
  const avail = app.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  // shrinking widens the view, letting content reflow shorter — refine until it fits
  let scale = 1;
  for (let pass = 0; pass < 4; pass++) {
    const needed = view.scrollHeight;
    if (needed * scale <= avail + 1) return; // fits
    scale = Math.max(0.35, avail / needed);
    view.style.width = `${(100 / scale).toFixed(2)}%`;
    view.style.transform = `scale(${scale.toFixed(4)})`;
    if (view.scrollHeight > needed) {
      // content grows with width (aspect-ratio media) — scale down without widening
      view.style.width = "";
      view.style.transformOrigin = "top center";
      view.style.transform = `scale(${Math.max(0.35, avail / view.scrollHeight).toFixed(4)})`;
      return;
    }
  }
}
window.addEventListener("resize", fitView);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitView);

/* ---------- autoplay: cycle boards every 20s (toggle with A) ---------- */
const AUTOPLAY_MS = 20000;
let autoTimer = null;
const autoBadge = el("div", "autoplay-badge", `<span class="dot">▶</span> AUTO`);
autoBadge.hidden = true;
document.body.appendChild(autoBadge);

function setAutoplay(on) {
  clearInterval(autoTimer);
  autoTimer = null;
  if (on) {
    autoTimer = setInterval(() => {
      const hash = location.hash.replace(/^#\/?/, "");
      const i = BOARDS.findIndex(b => b.id === hash);
      location.hash = `#/${BOARDS[(i + 1) % BOARDS.length].id}`;
    }, AUTOPLAY_MS);
  }
  autoBadge.hidden = !on;
}

/* ---------- home ---------- */
function renderHome(view) {
  const grid = el("div", "home-grid");
  BOARDS.forEach((b, i) => {
    const n = b.count(DATA);
    const card = stag(el("a", "board-card"), i);
    card.href = `#/${b.id}`;
    card.innerHTML = `
      <span class="card-id">BOARD ${b.num}</span>
      <h2>${esc(b.title)}</h2>
      <span class="card-count ${n ? "" : "empty"}">${n ? `<b>${n}</b> RESPONSE${n === 1 ? "" : "S"}${SAMPLE_MODE ? " · SAMPLE" : ""}` : "AWAITING SIGNAL…"}</span>`;
    grid.appendChild(card);
  });
  view.appendChild(grid);
}

/* ---------- board chrome ---------- */
function renderBoardChrome(view, board) {
  const head = el("header", "board-head");
  head.innerHTML = `
    <span class="board-eyebrow">BOARD ${board.num} / 09</span>
    <h1>${esc(board.title)}</h1>
    <p class="board-prompt">${esc(board.prompt)}</p>`;
  view.appendChild(head);
  board.render(view);

  const i = BOARDS.indexOf(board);
  const prev = BOARDS[(i - 1 + BOARDS.length) % BOARDS.length];
  const next = BOARDS[(i + 1) % BOARDS.length];
  const pager = el("nav", "board-pager");
  pager.innerHTML = `
    <a href="#/${prev.id}">« ${prev.num}</a>
    <a href="#/">INDEX</a>
    <a href="#/${next.id}">${next.num} »</a>`;
  view.appendChild(pager);
}

/* ============================================================
   RENDERERS
   ============================================================ */

/* --- 01 relationship status --- */
function renderStatus(view) {
  const votes = DATA.status.votes;
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  if (!total) { emptyState(view, "votes"); photoStrip(view, DATA.status.photos); return; }
  sampleFlag(view);
  const max = Math.max(...Object.values(votes));
  const poll = el("div", "poll");
  Object.entries(votes).forEach(([label, n]) => {
    const row = el("div", "poll-row" + (n === max && n > 0 ? " winner" : ""));
    row.appendChild(el("div", "poll-label", `<span>${esc(label)}</span><span class="poll-num">${n}</span>`));
    const dots = el("div", "poll-dots");
    for (let i = 0; i < n; i++) {
      const d = el("span", "poll-dot");
      d.style.animationDelay = `${i * 0.03}s`;
      dots.appendChild(d);
    }
    row.appendChild(dots);
    poll.appendChild(row);
    countUp(row.querySelector(".poll-num"), n); // recount from zero, in step with the dots
  });
  poll.appendChild(el("p", "poll-total", `<span class="poll-grand">${total}</span> VOTES LOGGED · ONE PIXEL EACH`));
  countUp(poll.querySelector(".poll-grand"), total, 20);
  view.appendChild(poll);
  photoStrip(view, DATA.status.photos);
}

/* --- 02 journey oscilloscope --- */
function renderJourney(view) {
  const lines = DATA.journey.lines;
  if (!lines.length) { emptyState(view, "journey lines"); photoStrip(view, DATA.journey.photos); return; }
  sampleFlag(view);

  const W = 900, H = 480, PAD = { l: 40, r: 20, t: 20, b: 40 };
  const X = x => PAD.l + (x / 100) * (W - PAD.l - PAD.r);
  const Y = y => PAD.t + ((100 - y) / 200) * (H - PAD.t - PAD.b);

  const wrap = el("div", "scope-wrap");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Overlaid excitement-over-time lines for each attendee");

  // grid + axes
  let gridHtml = `<g class="scope-grid">`;
  for (let gy = -100; gy <= 100; gy += 50) gridHtml += `<line x1="${X(0)}" y1="${Y(gy)}" x2="${X(100)}" y2="${Y(gy)}"/>`;
  for (let gx = 0; gx <= 100; gx += 25) gridHtml += `<line x1="${X(gx)}" y1="${Y(-100)}" x2="${X(gx)}" y2="${Y(100)}"/>`;
  gridHtml += `</g>
    <g class="scope-axis">
      <text x="${X(0)}" y="${Y(100) - 6}">EXCITED</text>
      <text x="${X(0)}" y="${Y(-100) + 16}">SCEPTICAL</text>
      <text x="${X(0)}" y="${H - 8}">FIRST ENCOUNTER</text>
      <text x="${X(50)}" y="${H - 8}" text-anchor="middle">1 YEAR IN</text>
      <text x="${X(100)}" y="${H - 8}" text-anchor="end">NOW</text>
    </g>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(100)}" y2="${Y(0)}" stroke="#0d0d0d" stroke-width="1.5" stroke-dasharray="6 5"/>`;
  svg.innerHTML = gridHtml;

  // smooth path from points (Catmull-Rom → bezier)
  function pathFrom(points) {
    const p = points.map(([x, y]) => [X(x), Y(y)]);
    if (p.length < 2) return "";
    let d = `M ${p[0][0]} ${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  const tooltip = el("div", "scope-tooltip");
  const paths = [];

  lines.forEach((ln, idx) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathFrom(ln.points));
    path.setAttribute("class", "scope-path");
    path.dataset.idx = idx;
    svg.appendChild(path);
    paths.push(path);

    (ln.turningPoints || []).forEach(tp => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", X(tp.x)); c.setAttribute("cy", Y(tp.y));
      c.setAttribute("r", 7); c.setAttribute("class", "scope-tp");
      c.style.setProperty("--delay", `${idx * 0.18 + 1.2}s`);
      c.addEventListener("mouseenter", ev => {
        highlight(idx);
        showTip(ev, `${ln.label}: ${tp.text}`);
      });
      c.addEventListener("mouseleave", () => { highlight(-1); hideTip(); });
      svg.appendChild(c);
    });

    path.addEventListener("mouseenter", ev => { highlight(idx); showTip(ev, ln.label); });
    path.addEventListener("mousemove", ev => moveTip(ev));
    path.addEventListener("mouseleave", () => { highlight(-1); hideTip(); });
  });

  function highlight(idx) {
    paths.forEach((p, i) => {
      p.classList.toggle("hl", i === idx);
      p.classList.toggle("dim", idx !== -1 && i !== idx);
    });
    legendBtns.forEach((b, i) => b.classList.toggle("hl", i === idx));
  }
  function showTip(ev, text) { tooltip.textContent = text; tooltip.classList.add("show"); moveTip(ev); }
  function moveTip(ev) {
    const r = wrap.getBoundingClientRect();
    tooltip.style.left = `${ev.clientX - r.left}px`;
    tooltip.style.top = `${ev.clientY - r.top}px`;
  }
  function hideTip() { tooltip.classList.remove("show"); }

  wrap.appendChild(svg);
  wrap.appendChild(tooltip);
  view.appendChild(wrap);

  // draw each trace on like an oscilloscope sweep
  paths.forEach((p, i) => {
    p.style.setProperty("--len", p.getTotalLength());
    p.style.setProperty("--delay", `${i * 0.18}s`);
    p.classList.add("draw");
  });

  const legend = el("div", "scope-legend");
  const legendBtns = lines.map((ln, idx) => {
    const b = el("button", null, esc(ln.label));
    b.addEventListener("mouseenter", () => highlight(idx));
    b.addEventListener("mouseleave", () => highlight(-1));
    b.addEventListener("focus", () => highlight(idx));
    b.addEventListener("blur", () => highlight(-1));
    legend.appendChild(b);
    return b;
  });
  view.appendChild(legend);
  photoStrip(view, DATA.journey.photos);
}

/* --- 03 celebrate vs miss --- */
function renderCelebrate(view) {
  const d = DATA.celebrateMiss;
  const total = d.celebrate.length + d.miss.length;
  if (!total) { emptyState(view, "responses"); photoStrip(view, d.photos); return; }
  sampleFlag(view);

  const meter = el("div", "balance-meter");
  const pcA = Math.round((d.celebrate.length / total) * 100);
  meter.innerHTML = `
    <div class="balance-labels"><span>CELEBRATE ${d.celebrate.length}</span><span>MISS ${d.miss.length}</span></div>
    <div class="balance-bar">
      <div class="side-a" style="width:${pcA}%"></div>
      <div class="side-b" style="width:${100 - pcA}%"></div>
    </div>`;
  view.appendChild(meter);

  const wall = el("div", "split-wall");
  const colA = el("div", "split-col celebrate", `<h3>Would celebrate…</h3>`);
  const ulA = el("ul");
  d.celebrate.forEach((t, i) => ulA.appendChild(stag(el("li", null, esc(t)), i, 0.07)));
  colA.appendChild(ulA);
  const colB = el("div", "split-col miss", `<h3>Would miss…</h3>`);
  const ulB = el("ul");
  d.miss.forEach((t, i) => ulB.appendChild(stag(el("li", null, esc(t)), i, 0.07)));
  colB.appendChild(ulB);
  wall.append(colA, colB);
  view.appendChild(wall);
  photoStrip(view, d.photos);
}

/* --- 04 obituaries --- */
function renderObituary(view) {
  const entries = DATA.obituaries.entries;
  if (!entries.length) { emptyState(view, "obituaries"); photoStrip(view, DATA.obituaries.photos); return; }
  sampleFlag(view);

  const page = el("div", "obituary-page");
  page.innerHTML = `
    <div class="obit-masthead">
      <span class="obit-paper-name">THE DAILY MACHINE</span>
      <span class="obit-strap">In memoriam · Deaths, generative · Final edition</span>
    </div>`;
  const cols = el("div", "obit-cols");
  entries.forEach((o, i) => {
    const item = stag(el("article", "obit"), i, 0.15);
    item.innerHTML = `
      ${o.lede ? `<p class="obit-lede">${esc(o.lede)}</p>` : ""}
      <p>${esc(o.text)}</p>
      ${o.author ? `<p class="obit-sig">— ${esc(o.author)}</p>` : ""}`;
    cols.appendChild(item);
  });
  page.appendChild(cols);
  view.appendChild(page);
  photoStrip(view, DATA.obituaries.photos);
}

/* --- 05 third way post-it wall --- */
function renderThirdWay(view) {
  const entries = DATA.thirdWay.entries;
  if (!entries.length) { emptyState(view, "proposals"); photoStrip(view, DATA.thirdWay.photos); return; }
  sampleFlag(view);

  const wall = el("div", "postit-wall");
  entries.forEach((e, i) => {
    const note = stag(el("div", `postit ${e.type === "written" ? "written" : ""}`), i, 0.08);
    note.style.setProperty("--tilt", `${((i * 137) % 7) - 3}deg`); // deterministic wobble
    note.innerHTML = `${esc(e.text)}<span class="postit-meta">${e.type === "written" ? "written on board" : "post-it"}</span>`;
    wall.appendChild(note);
  });
  view.appendChild(wall);
  photoStrip(view, DATA.thirdWay.photos);
}

/* --- 06 replace-AI ballots --- */
function renderReplace(view) {
  const entries = DATA.replace.entries;
  if (!entries.length) { emptyState(view, "answers"); photoStrip(view, DATA.replace.photos); return; }
  sampleFlag(view);

  const max = Math.max(...entries.map(e => e.count || 1));
  const wall = el("div", "ballot-wall");
  [...entries].sort((a, b) => (b.count || 1) - (a.count || 1)).forEach((e, i) => {
    const n = e.count || 1;
    const size = max <= 1 ? 1 : Math.min(4, 1 + Math.round((n / max) * 3));
    const b = stag(el("div", "ballot", `${esc(e.text)}${n > 1 ? `<span class="tally">×${n}</span>` : ""}`), i, 0.07);
    b.dataset.size = size;
    wall.appendChild(b);
  });
  view.appendChild(wall);
  photoStrip(view, DATA.replace.photos);
}

/* --- 07 deprecation log --- */
function renderStopped(view) {
  const entries = DATA.stopped.entries;
  if (!entries.length) { emptyState(view, "deprecation notices"); photoStrip(view, DATA.stopped.photos); return; }
  sampleFlag(view);

  const log = el("div", "deplog");
  log.setAttribute("role", "list");
  entries.forEach((e, i) => {
    const line = stag(el("div", "log-line"), i, 0.35);
    line.setAttribute("role", "listitem");
    line.innerHTML = `<span class="log-tag">DEPRECATED</span><span class="log-what">${esc(e.what)}</span><span class="log-why">${esc(e.why)}</span>`;
    log.appendChild(line);
  });
  view.appendChild(log);
  photoStrip(view, DATA.stopped.photos);
}

/* --- 08 the beginning of... --- */
function renderBeginning(view) {
  const entries = DATA.beginning.entries;
  if (!entries.length) { emptyState(view, "completions"); photoStrip(view, DATA.beginning.photos); return; }
  sampleFlag(view);

  const hero = el("p", "beginning-hero");
  hero.innerHTML = `The end of AI means the beginning of <span class="typed"></span><span class="cursor" aria-hidden="true"></span>`;
  view.appendChild(hero);

  const typed = hero.querySelector(".typed");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let idx = 0, timer;

  function typePhrase(phrase, done) {
    if (reduced) { typed.textContent = phrase; timer = setTimeout(done, 2600); return; }
    let i = 0;
    (function tick() {
      typed.textContent = phrase.slice(0, ++i);
      if (i < phrase.length) timer = setTimeout(tick, 55);
      else timer = setTimeout(() => erase(done), 2200);
    })();
  }
  function erase(done) {
    let t = typed.textContent;
    (function tick() {
      t = t.slice(0, -1);
      typed.textContent = t;
      if (t.length) timer = setTimeout(tick, 25);
      else done();
    })();
  }
  (function cycle() {
    typePhrase(entries[idx % entries.length], () => { idx++; cycle(); });
  })();
  // clear timers if we navigate away
  const obs = new MutationObserver(() => {
    if (!document.body.contains(hero)) { clearTimeout(timer); obs.disconnect(); }
  });
  obs.observe(app, { childList: true });

  const list = el("ul", "beginning-list");
  entries.forEach((t, i) => list.appendChild(stag(el("li", null, esc(t)), i, 0.06)));
  view.appendChild(list);
  photoStrip(view, DATA.beginning.photos);
}

/* --- 09 eco gallery --- */
function renderEco(view) {
  const entries = DATA.eco.entries;
  if (!entries.length) { emptyState(view, "drawings"); photoStrip(view, DATA.eco.photos); return; }
  sampleFlag(view);

  const gal = el("div", "eco-gallery");
  entries.forEach((e, i) => {
    const f = stag(el("figure"), i, 0.07);
    f.innerHTML = `<img src="${esc(e.src)}" alt="${esc(e.caption || "Ecological footprint drawing")}" loading="lazy"><figcaption>${esc(e.caption || "")}</figcaption>`;
    f.addEventListener("click", () => openLightbox(e.src, e.caption));
    gal.appendChild(f);
  });
  view.appendChild(gal);
  photoStrip(view, DATA.eco.photos);
}

/* ---------- lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbCap = document.getElementById("lightbox-caption");
function openLightbox(src, caption) {
  lbImg.src = src;
  lbImg.alt = caption || "";
  lbCap.textContent = caption || "";
  lightbox.hidden = false;
  document.getElementById("lightbox-close").focus();
}
function closeLightbox() { lightbox.hidden = true; lbImg.src = ""; }
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

/* ---------- go ----------
   ?kiosk starts hands-off: presentation mode forced on and autoplay
   running — for an unattended screen at the venue. */
if (new URLSearchParams(location.search).has("kiosk")) {
  presentOverride = true;
  setAutoplay(true);
}
applyPresenting();
route();

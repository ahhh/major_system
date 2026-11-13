(() => {
  const $ = (id) => document.getElementById(id);
  const BANKS = window.WORD_BANKS;
  const MIN_WORDS = 1, MAX_WORDS = 8;

  const state = {
    level: "easy",
    count: 4,
    pao: false,
    scenes: 2,
    seed: "",
    round: 1,
    puzzle: [],
    peeked: new Set(),
    solved: false,
    done: false, // counted toward stats already
  };

  // ---------- Seeded random ----------
  function hashString(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(a) {
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomSeed() {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let s = "";
    for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  // Group words by their digits so every number is equally likely,
  // no matter how many words a number has.
  const groups = {};
  for (const level of Object.keys(BANKS)) {
    const map = new Map();
    for (const [w, d, n] of BANKS[level]) {
      if (!map.has(d)) map.set(d, []);
      map.get(d).push({ w, d, n });
    }
    groups[level] = [...map.values()];
  }

  const MAX_SCENES = 4;
  const ROLES = ["person", "action", "object"];
  const paoOn = () => state.pao;
  const pad2 = (n) => String(n).padStart(2, "0");
  const HARD_PAO_SHARE = 0.6; // in Hard, how often a slot is forced to a tricky word

  function pickPao(role, rng) {
    if (state.level === "easy") {
      const d = Math.floor(rng() * 10);
      return { w: window.PAO_EASY[role][d], d: String(d), role };
    }
    const hard = state.level === "hard" ? window.PAO_HARD[role] : null;
    if (hard && rng() < HARD_PAO_SHARE) {
      const [w, d, n] = hard[Math.floor(rng() * hard.length)];
      return { w, d, n, role };
    }
    const num = Math.floor(rng() * 100);
    const d = pad2(num);
    const alt = hard && hard.find((e) => e[1] === d);
    if (alt) return { w: alt[0], d, n: alt[2], role };
    return { w: window.PAO_MEDIUM[role][num], d, role };
  }

  const PAO_INTRO = {
    easy: "Every 3 digits make one scene: 9 7 8 = <i>pirate kicking a fish</i>.",
    medium: "Each word is 2 digits, so one scene holds 6: 14 70 49 = <i>Thor kiss rope</i>.",
    hard: "Like Medium, but often swaps in a tricky spelling (shown in <i>italics</i>): 21 58 82 = <i>knight laugh phone</i>.",
  };

  function renderPaoKey() {
    const lvl = state.level;
    $("paoIntro").innerHTML = PAO_INTRO[lvl];
    const size = lvl === "easy" ? 10 : 100;
    const cell = (role, i) => {
      if (lvl === "easy") return window.PAO_EASY[role][i];
      let html = window.PAO_MEDIUM[role][i];
      const alt = lvl === "hard" && window.PAO_HARD[role].find((e) => e[1] === pad2(i));
      if (alt) html += ` / <i>${alt[0]}</i>`;
      return html;
    };
    let rows = "";
    for (let i = 0; i < size; i++) {
      const label = lvl === "easy" ? i : pad2(i);
      rows += `<tr><td>${label}</td>${ROLES.map((r) => `<td>${cell(r, i)}</td>`).join("")}</tr>`;
    }
    $("paoKey").innerHTML =
      `<table class="keytable pao"><tr><td></td><td>Person</td><td>Action</td><td>Object</td></tr>${rows}</table>`;
  }

  function buildPuzzle() {
    state.peeked = new Set();
    state.solved = false;
    state.done = false;

    if (paoOn()) {
      const rng = mulberry32(hashString(`${state.seed}|pao|${state.level}|${state.scenes}|${state.round}`));
      state.puzzle = [];
      for (let s = 0; s < state.scenes; s++) {
        for (const role of ROLES) state.puzzle.push(pickPao(role, rng));
      }
      return;
    }

    const rng = mulberry32(hashString(`${state.seed}|${state.level}|${state.count}|${state.round}`));
    const pool = groups[state.level];
    const used = new Set();
    const out = [];
    while (out.length < state.count) {
      let pick;
      for (let tries = 0; tries < 30; tries++) {
        const group = pool[Math.floor(rng() * pool.length)];
        pick = group[Math.floor(rng() * group.length)];
        if (!used.has(pick.w)) break;
      }
      used.add(pick.w);
      out.push(pick);
    }
    state.puzzle = out;
  }

  const answer = () => state.puzzle.map((p) => p.d).join("");
  // Answer split into readable chunks: per scene in PAO, per word otherwise.
  function answerChunks() {
    if (!paoOn()) return state.puzzle.map((p) => p.d);
    const chunks = [];
    for (let i = 0; i < state.puzzle.length; i += 3) {
      chunks.push(state.puzzle.slice(i, i + 3).map((p) => p.d).join(""));
    }
    return chunks;
  }

  // ---------- Stats (per-browser, optional) ----------
  const STATS_KEY = "major-practice-stats";
  let stats = { right: 0, tries: 0, streak: 0, best: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY));
    if (saved) stats = { ...stats, ...saved };
  } catch {}
  function saveStats() {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch {}
    renderStats();
  }
  function renderStats() {
    $("stats").textContent = `${stats.right}/${stats.tries} right · streak ${stats.streak} · best ${stats.best}`;
  }

  // ---------- URL (shareable puzzles) ----------
  function readUrl() {
    const p = new URLSearchParams(location.hash.slice(1));
    if (BANKS[p.get("l")]) state.level = p.get("l");
    const n = parseInt(p.get("n"), 10);
    if (n >= MIN_WORDS && n <= MAX_WORDS) state.count = n;
    state.pao = p.get("p") === "1";
    const sc = parseInt(p.get("sc"), 10);
    if (sc >= 1 && sc <= MAX_SCENES) state.scenes = sc;
    state.seed = p.get("s") || randomSeed();
    const r = parseInt(p.get("r"), 10);
    state.round = r > 0 ? r : 1;
  }
  function writeUrl() {
    const p = new URLSearchParams({ l: state.level, n: state.count, s: state.seed, r: state.round });
    if (state.pao) { p.set("p", "1"); p.set("sc", state.scenes); }
    history.replaceState(null, "", "#" + p.toString());
  }

  // ---------- Render ----------
  function render() {
    document.querySelectorAll(".level").forEach((b) => {
      b.setAttribute("aria-checked", String(b.dataset.level === state.level));
    });
    const pao = paoOn();
    $("paoBtn").setAttribute("aria-pressed", String(pao));
    $("countLabel").textContent = pao ? "Scenes" : "Words";
    $("count").textContent = pao ? state.scenes : state.count;
    $("seed").value = state.seed;
    $("meta").textContent = `seed ${state.seed} · #${state.round}`;

    const wrap = $("words");
    wrap.innerHTML = "";
    wrap.classList.toggle("pao", pao);
    let container = wrap;
    state.puzzle.forEach((p, i) => {
      if (pao && i % 3 === 0) {
        container = document.createElement("div");
        container.className = "scene";
        wrap.appendChild(container);
        if (state.level === "easy") {
          const [P, A, O] = state.puzzle.slice(i, i + 3);
          const sentence = document.createElement("div");
          sentence.className = "scene-text";
          sentence.textContent = `${P.w} ${A.w} a ${O.w}`;
          wrap.appendChild(sentence);
        }
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "word";
      const show = state.solved || state.peeked.has(i);
      btn.setAttribute("aria-label", show ? `${p.w}, ${p.d}` : `${p.w}, tap to peek`);
      btn.innerHTML = `${p.role ? `<span class="r">${p.role}</span>` : ""}<span class="w"></span><span class="d${show ? "" : " hidden"}"></span>`;
      btn.querySelector(".w").textContent = p.w;
      if (show) btn.querySelector(".d").textContent = p.d;
      if (state.solved && p.n) {
        const note = document.createElement("span");
        note.className = "n";
        note.textContent = p.n;
        btn.appendChild(note);
      }
      btn.addEventListener("click", () => {
        if (state.peeked.has(i)) state.peeked.delete(i);
        else state.peeked.add(i);
        render();
      });
      container.appendChild(btn);
    });

    document.querySelectorAll("#keyDialog [data-for]").forEach((el) => {
      const tags = el.dataset.for.split(" ");
      el.hidden = !(tags.includes(state.level) || (pao && tags.includes("pao")));
    });
    if (pao) renderPaoKey();
    $("keyTitle").textContent = `Key · ${state.level[0].toUpperCase()}${state.level.slice(1)}`;
  }

  function setFeedback(text, kind) {
    const fb = $("feedback");
    fb.textContent = text;
    fb.className = "feedback" + (kind ? " " + kind : "");
    const g = $("guess");
    g.classList.remove("good", "bad");
    if (kind) {
      void g.offsetWidth; // restart shake animation
      g.classList.add(kind);
    }
  }

  function newPuzzle({ keepGuess = false } = {}) {
    buildPuzzle();
    writeUrl();
    render();
    if (!keepGuess) $("guess").value = "";
    setFeedback("", "");
  }

  // ---------- Actions ----------
  function check() {
    const guess = $("guess").value.replace(/\D/g, "");
    if (!guess) return;
    const ok = guess === answer();
    if (!state.done) {
      state.done = true;
      stats.tries++;
      if (ok && !state.solved && state.peeked.size === 0) {
        stats.right++;
        stats.streak++;
        stats.best = Math.max(stats.best, stats.streak);
      } else {
        stats.streak = 0;
      }
      saveStats();
    }
    if (ok) {
      const assisted = state.peeked.size > 0 || state.solved;
      setFeedback(assisted ? "Correct (with help)" : "Correct!", "good");
      state.solved = true;
      render();
    } else {
      setFeedback(`Not quite. You entered ${guess.length} digits; the answer has ${answer().length}.`, "bad");
    }
  }

  function solve() {
    state.solved = true;
    if (!state.done) {
      state.done = true;
      stats.tries++;
      stats.streak = 0;
      saveStats();
    }
    render();
    setFeedback(`Answer: ${answerChunks().join(" ")}`, "");
  }

  function next() {
    state.round++;
    newPuzzle();
  }

  function setLevel(level) {
    if (level === state.level) return;
    state.level = level;
    state.round = 1;
    newPuzzle();
  }

  function togglePao() {
    state.pao = !state.pao;
    state.round = 1;
    newPuzzle();
  }

  function stepCount(delta) {
    if (paoOn()) {
      const s = Math.max(1, Math.min(MAX_SCENES, state.scenes + delta));
      if (s === state.scenes) return;
      state.scenes = s;
      state.round = 1;
      newPuzzle();
    } else {
      setCount(state.count + delta);
    }
  }

  function setCount(n) {
    n = Math.max(MIN_WORDS, Math.min(MAX_WORDS, n));
    if (n === state.count) return;
    state.count = n;
    state.round = 1;
    newPuzzle();
  }

  const dialog = $("keyDialog");
  function toggleKey() {
    if (dialog.open) dialog.close();
    else dialog.showModal();
  }

  // ---------- Wire up ----------
  document.querySelectorAll(".level").forEach((b) => b.addEventListener("click", () => setLevel(b.dataset.level)));
  $("countDown").addEventListener("click", () => stepCount(-1));
  $("countUp").addEventListener("click", () => stepCount(1));
  $("paoBtn").addEventListener("click", togglePao);
  $("seedForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const s = $("seed").value.trim();
    state.seed = s || randomSeed();
    state.round = 1;
    $("seed").blur();
    newPuzzle();
  });
  $("randomSeed").addEventListener("click", () => {
    state.seed = randomSeed();
    state.round = 1;
    newPuzzle();
  });
  $("guessForm").addEventListener("submit", (e) => {
    e.preventDefault();
    check();
  });
  $("guess").addEventListener("input", () => setFeedback("", ""));
  $("solveBtn").addEventListener("click", solve);
  $("nextBtn").addEventListener("click", next);
  $("keyBtn").addEventListener("click", toggleKey);
  $("closeKey").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close(); // tap backdrop to close
  });
  $("resetStats").addEventListener("click", () => {
    if (confirm("Reset your score?")) {
      stats = { right: 0, tries: 0, streak: 0, best: 0 };
      saveStats();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.matches("input")) return;
    const k = e.key.toLowerCase();
    if (k === "k" || k === "?") { e.preventDefault(); toggleKey(); }
    else if (dialog.open) return;
    else if (k === "n") next();
    else if (k === "s") solve();
    else if (k === "p") togglePao();
    else if (k === "1") setLevel("easy");
    else if (k === "2") setLevel("medium");
    else if (k === "3") setLevel("hard");
  });

  window.addEventListener("hashchange", () => {
    readUrl();
    newPuzzle();
  });

  readUrl();
  renderStats();
  newPuzzle();
})();

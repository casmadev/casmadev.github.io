/* ========================================================================
 * casmadev.github.io — resumé page
 *
 * Edit PROJECTS and SKILLS below to keep the page up to date; everything
 * else is progressive enhancement (drag, reveal, version fetch).
 * ===================================================================== */

/* ---------- Data: projects ----------
 * The whole card links to `landingUrl`. The version chip and the npm
 * link only appear if the latest version is fetched from the npm
 * registry successfully. */
const PROJECTS = [
  {
    visual: `
      <div class="project__visual project__visual--board" aria-hidden="true">
        <span class="mini-note mini-note--yellow">idea</span>
        <span class="mini-note mini-note--blue">todo</span>
        <span class="mini-note mini-note--pink">ship it</span>
        <span class="mini-note mini-note--green">v1.0 🎉</span>
      </div>`,
    title: 'CasmaBoard',
    pkg: '@casmadev/board',
    description:
      'A React whiteboard built with DOM + CSS. Sticky notes with a handwritten font and a subtle 3D tilt that responds to camera motion and infinite pan & zoom.',
    landingUrl: 'https://casmadev.github.io/board/',
    demoUrl: 'https://casmadev.github.io/board/demo/',
    apiUrl: 'https://casmadev.github.io/board/api/',
    githubUrl: 'https://github.com/casmadev/board',
    npmUrl: 'https://www.npmjs.com/package/@casmadev/board',
  },
  {
    visual: `
      <div class="project__visual project__visual--planner" aria-hidden="true">
        <span class="mini-bar" style="--c: #ffba42; grid-column: 1 / span 3; grid-row: 1">Platform</span>
        <span class="mini-bar" style="--c: #6391fd; grid-column: 3 / span 3; grid-row: 2">Integrations</span>
        <span class="mini-bar" style="--c: #5ed18a; grid-column: 5 / span 3; grid-row: 3">Launch</span>
        <span class="mini-bar" style="--c: #c08bf4; grid-column: 2 / span 4; grid-row: 4">Design system</span>
      </div>`,
    title: 'CasmaPlanner',
    pkg: '@casmadev/planner',
    description:
      'A flexible React timeline / roadmap component. Generic typed rows, draggable task bars, point-in-time markers, configurable time units (day → quarter) and collapsible side panels.',
    landingUrl: 'https://casmadev.github.io/planner/',
    demoUrl: 'https://casmadev.github.io/planner/demo/',
    apiUrl: 'https://casmadev.github.io/planner/api/',
    githubUrl: 'https://github.com/casmadev/planner',
    npmUrl: 'https://www.npmjs.com/package/@casmadev/planner',
  },
];

/* ---------- Data: skills ---------- */
const SKILLS = [
  { name: 'React', group: 'Frontend' },
  { name: 'TypeScript', group: 'Frontend' },
  { name: 'CSS / DOM APIs', group: 'Frontend' },
  { name: 'OutSystems (O11/ODC)', group: 'Backend' },
  { name: '.NET', group: 'Backend' },
  { name: 'Node.js', group: 'Backend' },
  { name: 'REST API design', group: 'Backend' },
  { name: 'IBM i (AS/400) integration', group: 'Backend' },
  { name: 'Unit Testing', group: 'Backend' },
  { name: 'SQL Server', group: 'Data' },
  { name: 'PostgreSQL', group: 'Data' },
  { name: 'OpenSearch', group: 'Data' },
  { name: 'ETL & data synchronization', group: 'Data' },
  { name: 'AWS', group: 'DevOps' },
  { name: 'Infrastructure as Code', group: 'DevOps' },
  { name: 'CI/CD', group: 'DevOps' },
  { name: 'Solution architecture', group: 'Architecture & leadership' },
  { name: 'Distributed systems', group: 'Architecture & leadership' },
  { name: 'Performance engineering', group: 'Architecture & leadership' },
  { name: 'Developer experience', group: 'Architecture & leadership' },
  { name: 'Tech leadership & Agile', group: 'Architecture & leadership' },
  { name: 'Git', group: 'Tooling' },
  { name: 'VS Code', group: 'Tooling' },
  { name: 'Claude Code', group: 'Tooling' },
  { name: 'Game prototyping', group: 'Beyond the browser' },
];

const GROUP_COLORS = {
  Frontend: '#f97316',
  Backend: '#f4a259',
  Data: '#c08bf4',
  DevOps: '#54c7c7',
  'Architecture & leadership': '#ffba42',
  Tooling: '#8ec5ff',
  'Beyond the browser': '#a8e063',
};

/* ======================= Draggable sticky notes ======================= */
(() => {
  const board = document.getElementById('board');
  if (!board) return;

  // Whatever was touched last stays on top, like a real whiteboard.
  // Re-assign the whole stack each time so z-indexes stay small and
  // never climb above the sticky header (z-index: 50).
  const zOrder = [];
  const raise = (note) => {
    const i = zOrder.indexOf(note);
    if (i !== -1) zOrder.splice(i, 1);
    zOrder.push(note);
    zOrder.forEach((n, idx) => {
      n.style.zIndex = String(2 + idx);
    });
  };

  board.querySelectorAll('.note').forEach((note) => {
    let startX = 0;
    let startY = 0;
    let baseDx = 0;
    let baseDy = 0;

    note.addEventListener('pointerdown', (e) => {
      // Mouse/pen only — on touch screens, dragging fights page scrolling.
      if (e.pointerType === 'touch') return;
      e.preventDefault();
      note.setPointerCapture(e.pointerId);
      note.classList.add('is-dragging');
      raise(note);
      startX = e.clientX;
      startY = e.clientY;
      baseDx = parseFloat(note.style.getPropertyValue('--dx')) || 0;
      baseDy = parseFloat(note.style.getPropertyValue('--dy')) || 0;
    });

    note.addEventListener('pointermove', (e) => {
      if (!note.classList.contains('is-dragging')) return;
      const noteRect = note.getBoundingClientRect();
      let dx = baseDx + (e.clientX - startX);
      let dy = baseDy + (e.clientY - startY);

      // Notes may roam the whole page — just keep them inside the
      // document so they can't be lost past an edge.
      const curDx = parseFloat(note.style.getPropertyValue('--dx')) || 0;
      const curDy = parseFloat(note.style.getPropertyValue('--dy')) || 0;
      const left = noteRect.left + window.scrollX - curDx + dx;
      const top = noteRect.top + window.scrollY - curDy + dy;
      const docW = document.documentElement.clientWidth;
      const docH = document.documentElement.scrollHeight;
      dx -= Math.min(0, left - 4) + Math.max(0, left + noteRect.width - (docW - 4));
      dy -= Math.min(0, top - 4) + Math.max(0, top + noteRect.height - (docH - 4));

      note.style.setProperty('--dx', `${dx}px`);
      note.style.setProperty('--dy', `${dy}px`);
    });

    const drop = () => note.classList.remove('is-dragging');
    note.addEventListener('pointerup', drop);
    note.addEventListener('pointercancel', drop);

    // Keyboard support: arrow keys nudge the focused note.
    note.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 24 : 8;
      const moves = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const move = moves[e.key];
      if (!move) return;
      e.preventDefault();
      raise(note);
      const dx = (parseFloat(note.style.getPropertyValue('--dx')) || 0) + move[0];
      const dy = (parseFloat(note.style.getPropertyValue('--dy')) || 0) + move[1];
      note.style.setProperty('--dx', `${dx}px`);
      note.style.setProperty('--dy', `${dy}px`);
    });
  });
})();

/* ======================= Project cards ======================= */
(() => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PROJECTS.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'project reveal';
    // The title link is stretched over the whole card via CSS; the
    // other links sit above it (z-index) so they stay clickable.
    card.innerHTML = `
      ${p.visual}
      <div class="project__body">
        <h3>
          <a class="project__title-link" href="${p.landingUrl}">${p.title}</a>
          <span class="chip chip--live" hidden></span>
        </h3>
        <p class="project__pkg"><code>${p.pkg}</code></p>
        <p>${p.description}</p>
        <div class="project__links">
          <a href="${p.demoUrl}">Demo</a>
          <a href="${p.apiUrl}">API docs</a>
          <a href="${p.githubUrl}">GitHub</a>
          <a class="project__npm" href="${p.npmUrl}" hidden>npm</a>
        </div>
      </div>`;
    grid.appendChild(card);

    // Version chip + npm link appear only if the registry lookup works.
    fetch(`https://registry.npmjs.org/${encodeURIComponent(p.pkg)}/latest`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((info) => {
        if (!info.version) return;
        const chip = card.querySelector('.chip');
        chip.textContent = `v${info.version} on npm`;
        chip.hidden = false;
        card.querySelector('.project__npm').hidden = false;
      })
      .catch(() => {
        /* unpublished or offline — no version shown */
      });
  });
})();

/* ======================= Skills + filters ======================= */
(() => {
  const grid = document.getElementById('skills-grid');
  const filters = document.getElementById('skill-filters');
  if (!grid || !filters) return;

  const groups = ['All', ...new Set(SKILLS.map((s) => s.group))];
  let active = 'All';

  const chips = SKILLS.map((s) => {
    const chip = document.createElement('span');
    chip.className = 'skill';
    chip.dataset.group = s.group;
    const dot = document.createElement('i');
    dot.style.setProperty('--c', GROUP_COLORS[s.group] || '');
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(s.name));
    grid.appendChild(chip);
    return chip;
  });

  groups.forEach((group) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = group;
    btn.setAttribute('role', 'tab');
    if (group === active) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      active = group;
      filters.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
      chips.forEach((chip) => {
        chip.classList.toggle('is-dimmed', group !== 'All' && chip.dataset.group !== group);
      });
    });
    filters.appendChild(btn);
  });
})();

/* ======================= Scroll reveal + active nav ======================= */
(() => {
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Scrollspy: exactly one nav link active at a time — the last section
  // whose top has passed the reference line (35% down the viewport).
  // At the very bottom of the page, the last section wins regardless,
  // since a short final section may never reach the reference line.
  const navLinks = [...document.querySelectorAll('.top__nav a')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  let ticking = false;
  const setActive = () => {
    ticking = false;
    const refY = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= refY) current = s;
    });
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1];
    navLinks.forEach((a) => {
      a.classList.toggle('is-active', !!current && a.getAttribute('href') === `#${current.id}`);
    });
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(setActive);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  setActive();
})();

/* ======================= Footer year + "built with" ======================= */
document.getElementById('year').textContent = new Date().getFullYear();

// A new one on every visit — light, and on-theme.
const BUILT_WITH = [
  'DOM + CSS',
  'sticky notes',
  'LEGO bricks',
  'scooter rides',
  'Brazilian coffee',
  'systems thinking',
  'cloud formations',
  'zero runtime dependencies',
  'a sprinkle of AI',
  'pragmatism',
  'TypeScript and stubbornness',
  'low code, high standards',
];
document.getElementById('built-with').textContent =
  BUILT_WITH[Math.floor(Math.random() * BUILT_WITH.length)];

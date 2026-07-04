/* ========================================================================
 * casmadev.github.io — resumé page
 *
 * Edit SKILLS below to keep the page up to date; everything
 * else is progressive enhancement (drag, theme, reveal, copy buttons).
 * ===================================================================== */

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

/* ======================= Theme toggle ======================= */
(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    root.dataset.theme = 'dark';
  }

  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
})();

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

  const navLinks = [...document.querySelectorAll('.top__nav a')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const spotlight = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { rootMargin: '-35% 0px -55% 0px' }
  );
  sections.forEach((s) => spotlight.observe(s));
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

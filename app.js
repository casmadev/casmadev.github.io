/* ========================================================================
 * casmadev.github.io — resumé page
 *
 * Edit TIMELINE and SKILLS below to keep the page up to date; everything
 * else is progressive enhancement (drag, theme, reveal, copy buttons).
 * ===================================================================== */

/* ---------- Data: timeline (planner-style) ----------
 * columns: labels of the time axis header.
 * lanes:   each lane is one grid row. Bars use { start, span } as 1-based
 *          column indices, exactly like CasmaPlanner unit indices.
 *          Markers are point-in-time labels pinned to a column. */
const TIMELINE = {
  // One column per year, 2014 → 2026. Label every other year so the
  // header stays legible; empty strings render as blank header cells.
  columns: ['2014', '', '2016', '', '2018', '', '2020', '', '2022', '', '2024', '', '2026'],
  lanes: [
    {
      markers: [{ at: 13, label: '@casmadev/board v1.0.0 on npm 🎉' }],
    },
    {
      bars: [
        {
          start: 1,
          span: 1,
          color: '#c08bf4',
          label: 'Fullstack web dev',
          tip: 'First professional year — fullstack web applications and legacy-system migrations.',
        },
        {
          start: 2,
          span: 12,
          color: '#f4a259',
          label: 'Enterprise consulting & architecture',
          tip: 'Consulting for Brazilian and international customers in telecom, HR, auditing, insurance and retail. Bridging .NET, SQL Server, PostgreSQL and IBM i (AS/400) with AWS cloud architecture; tech lead in Agile teams; technical governance through ADRs and platform standards.',
        },
      ],
    },
    {
      bars: [
        {
          start: 12,
          span: 2,
          color: '#f97316',
          label: 'CasmaBoard',
          tip: 'Designed and built a DOM + CSS React whiteboard from scratch — sticky notes with 3D tilt, infinite pan & zoom, 8 locales, full TypeScript types. Shipped v1.0.0 to npm.',
        },
      ],
    },
    {
      bars: [
        {
          start: 13,
          span: 1,
          color: '#6366f1',
          label: 'CasmaPlanner',
          tip: 'A flexible React timeline / roadmap component — typed rows, draggable task bars, markers, configurable time units, collapsible side panels. In active development.',
        },
      ],
    },
    {
      bars: [
        {
          start: 2,
          span: 12,
          color: '#54c7c7',
          label: 'Open source & community',
          tip: 'Community components, games in Godot, dev tooling and lots of prototypes — the fun stuff that keeps the saw sharp.',
        },
      ],
    },
  ],
};

/* ---------- Data: skills ---------- */
const SKILLS = [
  { name: 'React', group: 'Frontend' },
  { name: 'TypeScript', group: 'Frontend' },
  { name: 'JavaScript', group: 'Frontend' },
  { name: 'CSS / DOM APIs', group: 'Frontend' },
  { name: 'HTML & accessibility', group: 'Frontend' },
  { name: 'i18n & RTL', group: 'Frontend' },
  { name: 'Component API design', group: 'Design' },
  { name: 'Design systems & theming', group: 'Design' },
  { name: 'UX for direct manipulation', group: 'Design' },
  { name: '.NET', group: 'Backend & data' },
  { name: 'Node.js', group: 'Backend & data' },
  { name: 'SQL Server', group: 'Backend & data' },
  { name: 'PostgreSQL', group: 'Backend & data' },
  { name: 'REST API design', group: 'Backend & data' },
  { name: 'ETL & data synchronization', group: 'Backend & data' },
  { name: 'IBM i (AS/400) integration', group: 'Backend & data' },
  { name: 'AWS', group: 'Cloud & identity' },
  { name: 'CloudFormation (IaC)', group: 'Cloud & identity' },
  { name: 'Amazon Cognito', group: 'Cloud & identity' },
  { name: 'Microsoft Entra', group: 'Cloud & identity' },
  { name: 'Solution architecture', group: 'Architecture & leadership' },
  { name: 'Architecture Decision Records', group: 'Architecture & leadership' },
  { name: 'Distributed systems', group: 'Architecture & leadership' },
  { name: 'Performance engineering', group: 'Architecture & leadership' },
  { name: 'Developer experience', group: 'Architecture & leadership' },
  { name: 'Tech leadership & Agile', group: 'Architecture & leadership' },
  { name: 'Rollup', group: 'Tooling' },
  { name: 'Vitest', group: 'Tooling' },
  { name: 'TypeDoc', group: 'Tooling' },
  { name: 'npm packaging (ESM + CJS)', group: 'Tooling' },
  { name: 'Git & GitHub Actions', group: 'Tooling' },
  { name: 'Godot / GDScript', group: 'Beyond the browser' },
  { name: 'Game prototyping', group: 'Beyond the browser' },
];

const GROUP_COLORS = {
  Frontend: '#f97316',
  Design: '#c4a7ff',
  'Backend & data': '#f4a259',
  'Cloud & identity': '#54c7c7',
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

/* ======================= Planner-style timeline ======================= */
(() => {
  const el = document.getElementById('planner');
  if (!el) return;

  const cols = TIMELINE.columns.length;
  const gridCols = `repeat(${cols}, 1fr)`;

  // One shared tooltip on <body>, so the planner's scroll container can't
  // clip it. Shown on hover/focus, toggled on tap.
  const tip = document.createElement('div');
  tip.className = 'planner-tip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  let tipOwner = null;

  const showTip = (bar, text) => {
    tipOwner = bar;
    tip.textContent = text;
    tip.classList.add('is-visible');
    const rect = bar.getBoundingClientRect();
    tip.style.left = '0px';
    tip.style.top = '0px';
    const tipRect = tip.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    left = Math.min(left, window.scrollX + document.documentElement.clientWidth - tipRect.width - 12);
    tip.style.left = `${Math.max(window.scrollX + 12, left)}px`;
    tip.style.top = `${rect.top + window.scrollY - tipRect.height - 10}px`;
  };

  const hideTip = (bar) => {
    if (bar && bar !== tipOwner) return;
    tipOwner = null;
    tip.classList.remove('is-visible');
  };

  const head = document.createElement('div');
  head.className = 'planner__head';
  head.style.gridTemplateColumns = gridCols;
  TIMELINE.columns.forEach((label) => {
    const span = document.createElement('span');
    span.textContent = label;
    head.appendChild(span);
  });
  el.appendChild(head);

  TIMELINE.lanes.forEach((lane) => {
    const row = document.createElement('div');
    row.className = 'planner__lane';
    row.style.gridTemplateColumns = gridCols;

    (lane.markers || []).forEach((m) => {
      const marker = document.createElement('span');
      marker.className = 'planner__marker';
      marker.style.gridColumn = String(m.at);
      marker.innerHTML = '<i></i>';
      marker.appendChild(document.createTextNode(m.label));
      row.appendChild(marker);
    });

    (lane.bars || []).forEach((b) => {
      const bar = document.createElement('button');
      bar.type = 'button';
      bar.className = 'planner__bar';
      bar.style.gridColumn = `${b.start} / span ${b.span}`;
      bar.style.setProperty('--c', b.color);

      const label = document.createElement('span');
      label.textContent = b.label;
      bar.appendChild(label);

      if (b.tip) {
        bar.addEventListener('mouseenter', () => showTip(bar, b.tip));
        bar.addEventListener('mouseleave', () => hideTip(bar));
        bar.addEventListener('focus', () => showTip(bar, b.tip));
        bar.addEventListener('blur', () => hideTip(bar));
        // Tap-to-toggle on touch devices (hover handles pointer devices).
        bar.addEventListener('click', () => {
          if (tipOwner === bar) hideTip(bar);
          else showTip(bar, b.tip);
        });
      }

      row.appendChild(bar);
    });

    el.appendChild(row);
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

/* ======================= Footer year ======================= */
document.getElementById('year').textContent = new Date().getFullYear();

// sidebar.js
// App sidebar (#pb-sidebar): fixed on the left, inline SVG icons, active highlight,
// optional badges (alerts/counters), and safe alongside any other <aside> (e.g., Info TOC).

(() => {
  // ------------------ Config ------------------
  const SIDEBAR_ID = 'pb-sidebar';
  const PRIMARY_LABEL = 'Primary';

  // You can dynamically override/extend this later via window.pbSidebar.setNav(...)
  let NAV = [
    { href: 'loss_predictions.html', label: 'Current Predictions', icon: 'loss_predictions' },
    { href: 'what_if.html',          label: 'What If Predictions', icon: 'what_if' },
    { href: 'analytics.html',        label: 'Analytics',           icon: 'analytics' },
    { href: 'tables.html',           label: 'All Data',            icon: 'tables' },
    { href: 'yield_explorer.html',   label: 'Yield Explorer',      icon: 'yield' },
    { href: 'batch_compare.html',    label: 'Batch Compare',       icon: 'batch_compare' },
    { href: 'recipe_analytics.html', label: 'Recipe Analytics',    icon: 'recipes_analytics' },
    { href: 'edit_recipes.html',     label: 'Edit Recipe',         icon: 'recipes_edit' },
    { href: 'anomalies.html', label: 'Anomalies', icon: 'anomaly' },
    { href: 'info.html',             label: 'Info & How-To',       icon: 'info' },
  ];

  const ACTIVE   = 'bg-[#0b1f52] text-white font-semibold shadow-sm';
  const INACTIVE = 'text-slate-700 hover:bg-slate-200';

  // Badge palette
  const BADGE_COLORS = {
    default: 'bg-slate-200 text-slate-700',
    info:    'bg-blue-100 text-blue-700',
    warn:    'bg-amber-100 text-amber-800',
    alert:   'bg-red-100 text-red-700',
    ok:      'bg-green-100 text-green-700',
  };

  // ------------------ Helpers ------------------
  const leaf = (path) =>
    (path || '')
      .split('?')[0]
      .split('#')[0]
      .split('/')
      .pop()
      .toLowerCase();

  const currentPage = () => {
    const file = leaf(location.pathname) || 'loss_predictions.html';
    const aliases = {
      'index.html': 'loss_predictions.html',
      'data.html':  'tables.html',
      '':           'loss_predictions.html',
    };
    return (aliases[file] || file).toLowerCase();
  };

  // ------------------ Icons ------------------
  function createIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('w-5', 'h-5', 'mr-2', 'shrink-0');

    const add = (node) => (svg.appendChild(node), svg);
    const P = (d) => { const p = document.createElementNS(svg.namespaceURI, 'path'); p.setAttribute('d', d); return p; };
    const R = (x, y, w, h, rx = 1.5) => { const r = document.createElementNS(svg.namespaceURI, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('rx', rx); return r; };
    const C = (cx, cy, r) => { const c = document.createElementNS(svg.namespaceURI, 'circle'); c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r); return c; };
    const L = (x1, y1, x2, y2) => { const l = document.createElementNS(svg.namespaceURI, 'line'); l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2); return l; };

    switch ((name || '').toLowerCase()) {
      case 'loss_predictions': {
        // Crystal ball (forecast)
        add(C(12, 10, 6));
        add(P('M8 20h8'));
        add(P('M7 20h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z'));
        add(P('M9 8a3 3 0 0 1 3-3'));
        break;
      }
      case 'analytics': {
        // Bars + axis
        add(R(5, 11, 3, 8));
        add(R(10.5, 7, 3, 12));
        add(R(16, 4, 3, 15));
        add(P('M4 21h16'));
        break;
      }
      case 'tables': {
        // Table grid
        add(R(3.5, 5, 17, 14, 2));
        add(P('M3.5 11.5h17'));
        add(P('M10.5 5v14'));
        add(P('M16.5 5v14'));
        break;
      }
      case 'what_if': {
        // Sliders
        add(L(4, 7, 20, 7));  add(C(10, 7, 2));
        add(L(4, 12, 20, 12)); add(C(15, 12, 2));
        add(L(4, 17, 20, 17)); add(C(7, 17, 2));
        break;
      }
      case 'batch_compare': {
        // Two line series (second dashed)
        const s1 = P('M4 16 L9 10 L14 14 L20 8');
        const s2 = P('M4 18 L9 12 L14 16 L20 10');
        s2.setAttribute('stroke-dasharray', '3 3');
        add(s1); add(s2);
        [ [4,16],[9,10],[14,14],[20,8] ].forEach(([x,y]) => add(C(x, y, 0.9)));
        [ [4,18],[9,12],[14,16],[20,10] ].forEach(([x,y]) => { const c=C(x,y,0.9); c.setAttribute('fill','currentColor'); add(c); });
        break;
      }
      case 'yield': {
        // Yield + trend
        add(R(4, 12, 3, 7));
        add(R(10, 9, 3, 10));
        add(R(16, 6, 3, 13));
        add(P('M3 21h18'));
        add(P('M4 6c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4'));
        break;
      }
      case 'recipes_analytics': {
        // Clipboard + mini chart
        add(R(5, 6, 14, 14, 2));        // sheet
        add(R(9, 3, 6, 3, 1.2));        // clip
        add(P('M7.5 18h9'));            // footer line
        add(R(8, 14.5, 2.5, 3));        // bar1
        add(R(11.5, 13, 2.5, 4.5));     // bar2
        add(R(15, 11.5, 2.5, 6));       // bar3
        break;
      }
      case 'recipes_edit': {
        // Document + pencil
        add(R(5, 5, 12, 14, 2));                      // document
        add(P('M7.5 10h9')); add(P('M7.5 13h9'));     // lines
        add(P('M17 9l2 2-7 7-3 1 1-3 7-7z'));         // pencil body + tip
        add(P('M16.5 9.5l2 2'));                      // accent
        break;
      }
      case 'anomaly': {
        // Triangle warning
        add(P('M12 3 L21 19 H3 Z'));           // triangle
        add(P('M12 8v5'));                      // exclamation bar
        add(C(12, 15.5, 0.8));                  // dot
        break;
    }
      case 'info': {
        // Info circle
        add(C(12, 12, 9));
        add(P('M12 8h.01'));     // dot
        add(P('M11 11h2v5h-2')); // i bar
        break;
      }
      default: {
        add(C(12, 12, 3));
        break;
      }
    }
    return svg;
  }

  // ------------------ Render ------------------
  let builtLinks = []; // keep refs for dynamic badge updates

  function ensureSidebar() {
    // ONLY target our dedicated app sidebar, not any other <aside> (like Info TOC)
    let aside = document.getElementById(SIDEBAR_ID);
    let nav   = aside ? aside.querySelector(`nav[aria-label="${PRIMARY_LABEL}"]`) : null;

    if (!aside) {
      aside = document.createElement('aside');
      aside.id = SIDEBAR_ID;
      aside.className = 'w-56 bg-slate-50 border-r shadow-lg';
      const shell =
        document.querySelector('header + .flex') ||
        document.querySelector('.flex.flex-1')   ||
        document.body;
      shell.insertBefore(aside, shell.firstChild);
    }

    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'mt-6 flex flex-col';
      nav.setAttribute('aria-label', PRIMARY_LABEL);
      aside.appendChild(nav);
    } else {
      nav.innerHTML = '';
    }

    builtLinks = [];

    const cur = currentPage();
    NAV.forEach((item) => {
      const a = document.createElement('a');
      const isActive = leaf(item.href) === cur;

      a.href = item.href;
      a.className =
        'flex items-center px-5 py-3 rounded-r-full mb-2 transition relative group ' +
        (isActive ? ACTIVE : INACTIVE);
      if (isActive) a.setAttribute('aria-current', 'page');
      a.setAttribute('title', item.label);

      // Icon, label
      a.appendChild(createIcon(item.icon));
      const span = document.createElement('span');
      span.textContent = item.label;
      a.appendChild(span);

      // Badge container
      const badge = document.createElement('span');
      badge.className = 'ml-auto text-[10px] px-1.5 py-0.5 rounded hidden';
      badge.dataset.role = 'badge';
      a.appendChild(badge);

      // Keyboard focus ring
      a.addEventListener('focus', () => a.classList.add('ring', 'ring-slate-300', 'outline-none'));
      a.addEventListener('blur',  () => a.classList.remove('ring', 'ring-slate-300'));

      nav.appendChild(a);
      builtLinks.push({ href: item.href, el: a, badge });
    });
  }

  // ------------------ Badges API ------------------
  function setBadge(hrefOrFile, count, color = 'default') {
    if (!builtLinks.length) return;
    const key = leaf(hrefOrFile);
    const link = builtLinks.find(x => leaf(x.href) === key);
    if (!link) return;

    if (count == null || count === 0) {
      link.badge.classList.add('hidden');
      link.badge.textContent = '';
      link.badge.className = 'ml-auto text-[10px] px-1.5 py-0.5 rounded hidden';
      return;
    }

    const palette = BADGE_COLORS[color] || BADGE_COLORS.default;
    link.badge.className = `ml-auto text-[10px] px-1.5 py-0.5 rounded ${palette}`;
    link.badge.textContent = String(count);
    link.badge.classList.remove('hidden');
  }

  function setNav(nextNavArray) {
    if (!Array.isArray(nextNavArray) || !nextNavArray.length) return;
    NAV = nextNavArray.slice();
    ensureSidebar();
  }

  function setLabel(hrefOrFile, newLabel) {
    const key = leaf(hrefOrFile);
    const link = builtLinks.find(x => leaf(x.href) === key);
    if (!link) return;
    const span = link.el.querySelector('span:not([data-role="badge"])');
    if (span) span.textContent = newLabel;
  }

  function setActive(hrefOrFile) {
    const key = leaf(hrefOrFile);
    builtLinks.forEach(({ href, el }) => {
      const isActive = leaf(href) === key;
      el.className =
        'flex items-center px-5 py-3 rounded-r-full mb-2 transition relative group ' +
        (isActive ? ACTIVE : INACTIVE);
      if (isActive) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }

  // Expose small API for pages to update badges dynamically
  window.pbSidebar = {
    setBadge, setNav, setLabel, setActive
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureSidebar();

    // Example badges you can drive from page data:
    // window.pbSidebar.setBadge('loss_predictions.html', 3, 'alert');   // 3 flagged
    // window.pbSidebar.setBadge('tables.html', 1, 'warn');              // 1 drift
    // window.pbSidebar.setBadge('recipe_analytics.html', 5, 'info');    // 5 insights
  });
})();
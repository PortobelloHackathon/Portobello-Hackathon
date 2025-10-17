// sidebar.js
// Injects a consistent sidebar (#pb-sidebar) on every page, uses inline SVG icons,
// and auto-highlights the active tab. Ignores any other <aside> (e.g., Info page TOC).

(() => {
  // ------------------ Config ------------------
  const SIDEBAR_ID = 'pb-sidebar';
  const PRIMARY_LABEL = 'Primary';

  const NAV = [
    { href: 'loss_predictions.html', label: 'Current Loss Predictions', icon: 'loss_predictions' },
    { href: 'what_if.html',          label: 'What If Predictions',     icon: 'what_if'          },
    { href: 'analytics.html',        label: 'Analytics',               icon: 'analytics'        },
    { href: 'tables.html',           label: 'All Data',                icon: 'tables'           },
    { href: 'yield_explorer.html',   label: 'Yield Explorer',          icon: 'yield'            },
    { href: 'batch_compare.html',    label: 'Batch Compare',           icon: 'batch_compare'    },
    { href: 'recipe_analytics.html', label: 'Recipe Analytics',        icon: 'recipes'          },
    { href: 'edit_recipes.html',     label: 'Edit Recipe',             icon: 'recipes'          },
    { href: 'info.html',             label: 'Info & How-To',           icon: 'info'             },
  ];

  const ACTIVE   = 'bg-[#0b1f52] text-white font-semibold shadow-sm';
  const INACTIVE = 'text-slate-700 hover:bg-slate-200';

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
        add(C(12, 10, 6));
        add(P('M8 20h8'));
        add(P('M7 20h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z'));
        add(P('M9 8a3 3 0 0 1 3-3'));
        break;
      }
      case 'analytics': {
        add(R(5, 11, 3, 8));
        add(R(10.5, 7, 3, 12));
        add(R(16, 4, 3, 15));
        add(P('M4 21h16'));
        break;
      }
      case 'tables': {
        add(R(3.5, 5, 17, 14, 2));
        add(P('M3.5 11.5h17'));
        add(P('M10.5 5v14'));
        add(P('M16.5 5v14'));
        break;
      }
      case 'what_if': {
        add(L(4, 7, 20, 7));  add(C(10, 7, 2));
        add(L(4, 12, 20, 12)); add(C(15, 12, 2));
        add(L(4, 17, 20, 17)); add(C(7, 17, 2));
        break;
      }
      case 'batch_compare': {
        const s1 = P('M4 16 L9 10 L14 14 L20 8');
        const s2 = P('M4 18 L9 12 L14 16 L20 10');
        s2.setAttribute('stroke-dasharray', '3 3');
        add(s1); add(s2);
        [ [4,16],[9,10],[14,14],[20,8] ].forEach(([x,y]) => add(C(x, y, 0.9)));
        [ [4,18],[9,12],[14,16],[20,10] ].forEach(([x,y]) => { const c=C(x,y,0.9); c.setAttribute('fill','currentColor'); add(c); });
        break;
      }
      case 'recipes': {
        add(R(5, 6, 14, 14, 2));
        add(R(9, 3, 6, 3, 1.2));
        add(P('M8 13l3 3 5-6'));
        add(P('M8 17h8'));
        break;
      }
      case 'yield': {
        add(R(4, 12, 3, 7));
        add(R(10, 9, 3, 10));
        add(R(16, 6, 3, 13));
        add(P('M3 21h18'));
        add(P('M4 6c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4'));
        break;
      }
      case 'info': {
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

  // ------------------ Sidebar builder ------------------
  function ensureSidebar() {
    // ONLY target our dedicated app sidebar, not any other <aside> (like Info TOC)
    let aside = document.getElementById(SIDEBAR_ID);
    let nav   = aside ? aside.querySelector(`nav[aria-label="${PRIMARY_LABEL}"]`) : null;

    // If our app sidebar doesn't exist, create it and insert as the first child of the main shell
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

    // Create or reset the primary nav inside our app sidebar
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'mt-6 flex flex-col';
      nav.setAttribute('aria-label', PRIMARY_LABEL);
      aside.appendChild(nav);
    } else {
      nav.innerHTML = '';
    }

    // Build links and highlight current
    const cur = currentPage();
    NAV.forEach((item) => {
      const a = document.createElement('a');
      const isActive = leaf(item.href) === cur;

      a.href = item.href;
      a.className =
        'flex items-center px-5 py-3 rounded-r-full mb-2 transition ' +
        (isActive ? ACTIVE : INACTIVE);
      if (isActive) a.setAttribute('aria-current', 'page');
      a.setAttribute('title', item.label);

      a.appendChild(createIcon(item.icon));
      const span = document.createElement('span');
      span.textContent = item.label;
      a.appendChild(span);

      nav.appendChild(a);
    });
  }

  document.addEventListener('DOMContentLoaded', ensureSidebar);
})();
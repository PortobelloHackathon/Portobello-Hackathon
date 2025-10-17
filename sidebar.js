// sidebar.js
// App sidebar (#pb-sidebar): fixed on the left, inline SVG icons, active highlight,
// optional badges (alerts/counters), and safe alongside any other <aside> (e.g., Info TOC).

(() => {
  // ------------------ Config ------------------
  const SIDEBAR_ID = 'pb-sidebar';
  const PRIMARY_LABEL = 'Primary';

  // Unified navigation
  let NAV = [
    { href: 'loss_predictions.html', label: 'Current Predictions', icon: 'loss_predictions' },
    { href: 'what_if.html',          label: 'What If Predictions', icon: 'what_if' },
    { href: 'model_performance.html',label: 'Model Performance',   icon: 'model_performance' },
    { href: 'analytics.html',        label: 'Analytics',           icon: 'analytics' },
    { href: 'tables.html',           label: 'All Data',            icon: 'tables' },
    { href: 'yield_explorer.html',   label: 'Yield Explorer',      icon: 'yield' },
    { href: 'batch_compare.html',    label: 'Batch Compare',       icon: 'batch_compare' },
    { href: 'recipe_analytics.html', label: 'Recipe Analytics',    icon: 'recipes_analytics' },
    { href: 'edit_recipes.html',     label: 'Edit Recipe',         icon: 'recipes_edit' },
    { href: 'info.html',             label: 'Info & How-To',       icon: 'info' },
  ];

  const ACTIVE   = 'bg-[#0b1f52] text-white font-semibold shadow-sm';
  const INACTIVE = 'text-slate-700 hover:bg-slate-200';

  const BADGE_COLORS = {
    default: 'bg-slate-200 text-slate-700',
    info:    'bg-blue-100 text-blue-700',
    warn:    'bg-amber-100 text-amber-800',
    alert:   'bg-red-100 text-red-700',
    ok:      'bg-green-100 text-green-700',
  };

  // ------------------ Helpers ------------------
  const leaf = (path) =>
    (path || '').split('?')[0].split('#')[0].split('/').pop().toLowerCase();

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
    svg.classList.add('w-5', 'h-5', 'mr-2', 'shrink-0');

    const add = (node) => (svg.appendChild(node), svg);
    const P = (d) => { const p=document.createElementNS(svg.namespaceURI,'path'); p.setAttribute('d',d); return p; };
    const R = (x,y,w,h,rx=1.5)=>{const r=document.createElementNS(svg.namespaceURI,'rect');r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',w);r.setAttribute('height',h);r.setAttribute('rx',rx);return r;};
    const C = (cx,cy,r)=>{const c=document.createElementNS(svg.namespaceURI,'circle');c.setAttribute('cx',cx);c.setAttribute('cy',cy);c.setAttribute('r',r);return c;};
    const L = (x1,y1,x2,y2)=>{const l=document.createElementNS(svg.namespaceURI,'line');l.setAttribute('x1',x1);l.setAttribute('y1',y1);l.setAttribute('x2',x2);l.setAttribute('y2',y2);return l;};

    switch ((name || '').toLowerCase()) {
      case 'loss_predictions': { add(C(12,10,6)); add(P('M8 20h8')); add(P('M7 20h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z')); add(P('M9 8a3 3 0 0 1 3-3')); break; }
      case 'analytics': { add(R(5,11,3,8)); add(R(10.5,7,3,12)); add(R(16,4,3,15)); add(P('M4 21h16')); break; }
      case 'model_performance': {
        // Bars + trendline + dots
        add(R(4, 14, 2.5, 7));
        add(R(9, 10, 2.5, 11));
        add(R(14, 7, 2.5, 14));
        add(R(19, 9, 2.5, 12));
        add(P('M4 21h18'));
        add(P('M3 13 L8 9 L13 11 L18 6 L21 9'));
        [[8,9],[13,11],[18,6],[21,9]].forEach(([x,y])=>{const c=C(x,y,0.9);c.setAttribute('fill','currentColor');add(c);});
        break;
      }
      case 'tables': { add(R(3.5,5,17,14,2)); add(P('M3.5 11.5h17')); add(P('M10.5 5v14')); add(P('M16.5 5v14')); break; }
      case 'what_if': { add(L(4,7,20,7)); add(C(10,7,2)); add(L(4,12,20,12)); add(C(15,12,2)); add(L(4,17,20,17)); add(C(7,17,2)); break; }
      case 'batch_compare': { const s1=P('M4 16 L9 10 L14 14 L20 8'); const s2=P('M4 18 L9 12 L14 16 L20 10'); s2.setAttribute('stroke-dasharray','3 3'); add(s1); add(s2); [[4,16],[9,10],[14,14],[20,8]].forEach(([x,y])=>add(C(x,y,0.9))); [[4,18],[9,12],[14,16],[20,10]].forEach(([x,y])=>{const c=C(x,y,0.9);c.setAttribute('fill','currentColor');add(c);}); break; }
      case 'yield': { add(R(4,12,3,7)); add(R(10,9,3,10)); add(R(16,6,3,13)); add(P('M3 21h18')); add(P('M4 6c2 0 2 4 4 4s2-4 4-4 2 4 4 4 2-4 4-4')); break; }
      case 'recipes_analytics': { add(R(5,6,14,14,2)); add(R(9,3,6,3,1.2)); add(P('M7.5 18h9')); add(R(8,14.5,2.5,3)); add(R(11.5,13,2.5,4.5)); add(R(15,11.5,2.5,6)); break; }
      case 'recipes_edit': { add(R(5,5,12,14,2)); add(P('M7.5 10h9')); add(P('M7.5 13h9')); add(P('M17 9l2 2-7 7-3 1 1-3 7-7z')); add(P('M16.5 9.5l2 2')); break; }
      case 'info': { add(C(12,12,9)); add(P('M12 8h.01')); add(P('M11 11h2v5h-2')); break; }
      default: { add(C(12,12,3)); break; }
    }
    return svg;
  }

  // ------------------ Render ------------------
  let builtLinks = [];
  function ensureSidebar() {
    let aside = document.getElementById(SIDEBAR_ID);
    let nav   = aside ? aside.querySelector(`nav[aria-label="${PRIMARY_LABEL}"]`) : null;
    // Desktop aside (hidden on small screens)
    if (!aside) {
      aside = document.createElement('aside');
      aside.id = SIDEBAR_ID;
      // hidden on small screens, visible md+
      aside.className = 'hidden md:block w-56 bg-slate-50 border-r shadow-lg';
      const shell = document.querySelector('header + .flex') || document.querySelector('.flex.flex-1') || document.body;
      shell.insertBefore(aside, shell.firstChild);
    }
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'mt-6 flex flex-col';
      nav.setAttribute('aria-label', PRIMARY_LABEL);
      aside.appendChild(nav);
    } else nav.innerHTML = '';

    // Mobile sidebar (slide-in overlay)
    let mobileAside = document.getElementById('pb-mobile-sidebar');
    let mobileNav = mobileAside ? mobileAside.querySelector('nav[aria-label="' + PRIMARY_LABEL + '"]') : null;
    if (!mobileAside) {
      mobileAside = document.createElement('aside');
      mobileAside.id = 'pb-mobile-sidebar';
      mobileAside.className = 'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r p-4 transform -translate-x-full transition-transform md:hidden';
      document.body.appendChild(mobileAside);
    }
    if (!mobileNav) {
      mobileNav = document.createElement('nav');
      mobileNav.className = 'mt-6 flex flex-col';
      mobileNav.setAttribute('aria-label', PRIMARY_LABEL);
      mobileAside.appendChild(mobileNav);
    } else mobileNav.innerHTML = '';

    // Backdrop for mobile
    let backdrop = document.getElementById('pb-sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'pb-sidebar-backdrop';
      backdrop.className = 'fixed inset-0 bg-black bg-opacity-40 hidden z-40 md:hidden';
      document.body.appendChild(backdrop);
    }

    // Add toggle button to header for mobile
    const hdr = document.querySelector('header');
    if (hdr && !document.getElementById('pb-sidebar-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'pb-sidebar-toggle';
      btn.className = 'md:hidden ml-3 p-2 rounded bg-slate-100 text-slate-700';
      btn.setAttribute('aria-label','Open sidebar');
      btn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>';
      // place in header start (append to header container)
      const headerInner = hdr.querySelector('div') || hdr;
      headerInner.insertBefore(btn, headerInner.firstChild);

      // open/close handlers
      const openMobile = () => { mobileAside.classList.remove('-translate-x-full'); mobileAside.classList.add('translate-x-0'); backdrop.classList.remove('hidden'); };
      const closeMobile = () => { mobileAside.classList.add('-translate-x-full'); mobileAside.classList.remove('translate-x-0'); backdrop.classList.add('hidden'); };
      btn.addEventListener('click', openMobile);
      backdrop.addEventListener('click', closeMobile);
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeMobile(); });
    }

    builtLinks = [];
    const cur = currentPage();
    NAV.forEach(item => {
      // Desktop link
      const a = document.createElement('a');
      const isActive = leaf(item.href) === cur;
      a.href = item.href;
      a.className =
        'flex items-center px-5 py-3 rounded-r-full mb-2 transition relative group ' +
        (isActive ? ACTIVE : INACTIVE);
      if (isActive) a.setAttribute('aria-current', 'page');
      a.setAttribute('title', item.label);
      a.appendChild(createIcon(item.icon));
      const span = document.createElement('span');
      span.textContent = item.label;
      a.appendChild(span);
      const badge = document.createElement('span');
      badge.className = 'ml-auto text-[10px] px-1.5 py-0.5 rounded hidden';
      badge.dataset.role = 'badge';
      a.appendChild(badge);
      nav.appendChild(a);

      // Mobile link (clone content) inside mobileNav
      const aM = document.createElement('a');
      aM.href = item.href;
      aM.className = 'flex items-center px-4 py-3 rounded mb-2 group text-slate-800';
      aM.setAttribute('title', item.label);
      aM.appendChild(createIcon(item.icon));
      const spanM = document.createElement('span'); spanM.textContent = item.label; aM.appendChild(spanM);
      const badgeM = document.createElement('span'); badgeM.className = 'ml-auto text-[10px] px-1.5 py-0.5 rounded hidden'; badgeM.dataset.role = 'badge'; aM.appendChild(badgeM);
      mobileNav.appendChild(aM);

      builtLinks.push({ href: item.href, el: a, badge: badge, elMobile: aM, badgeMobile: badgeM });
    });
  }

  // ------------------ Badge / Active API ------------------
  function setBadge(hrefOrFile, count, color = 'default') {
    const key = leaf(hrefOrFile);
    const link = builtLinks.find(x => leaf(x.href) === key);
    if (!link) return;
    if (!count) {
      if (link.badge) link.badge.classList.add('hidden');
      if (link.badgeMobile) link.badgeMobile.classList.add('hidden');
      if (link.badge) link.badge.textContent = '';
      if (link.badgeMobile) link.badgeMobile.textContent = '';
      return;
    }
    const palette = BADGE_COLORS[color] || BADGE_COLORS.default;
    if (link.badge) { link.badge.className = `ml-auto text-[10px] px-1.5 py-0.5 rounded ${palette}`; link.badge.textContent = String(count); link.badge.classList.remove('hidden'); }
    if (link.badgeMobile) { link.badgeMobile.className = `ml-auto text-[10px] px-1.5 py-0.5 rounded ${palette}`; link.badgeMobile.textContent = String(count); link.badgeMobile.classList.remove('hidden'); }
  }

  function setActive(hrefOrFile) {
    const key = leaf(hrefOrFile);
    builtLinks.forEach(({ href, el, elMobile }) => {
      const isActive = leaf(href) === key;
      if (el) {
        el.className = 'flex items-center px-5 py-3 rounded-r-full mb-2 transition relative group ' + (isActive ? ACTIVE : INACTIVE);
        if (isActive) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
      }
      if (elMobile) {
        elMobile.classList.toggle('text-slate-900', isActive);
        elMobile.classList.toggle('bg-slate-100', isActive);
        if (isActive) elMobile.setAttribute('aria-current', 'page'); else elMobile.removeAttribute('aria-current');
      }
    });
  }

  window.pbSidebar = { setBadge, setActive };

  document.addEventListener('DOMContentLoaded', ensureSidebar);
})();
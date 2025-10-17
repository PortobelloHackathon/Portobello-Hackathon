// loss_predictions.js — populate cycleSelection and auto-fill the page + expose selected doc
(() => {
  const byId = (id) => document.getElementById(id);

  const toDatetimeLocal = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(+d)) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const setVal = (id, val) => {
    const el = byId(id);
    if (!el) return;
    if (id === 'datetime') { el.value = toDatetimeLocal(val); return; }
    if (el.tagName === 'SELECT') { el.value = val == null ? '' : String(val); return; }
    if (el.type === 'number') {
      const n = Number(val);
      el.value = Number.isFinite(n) ? n : '';
      return;
    }
    el.value = val ?? '';
  };

  const lockLayers = () => {
    const lt = byId('layers_tossed');
    if (lt) {
      lt.value = 24;
      lt.readOnly = true;
      lt.disabled = true;
      lt.classList.add('bg-slate-100', 'cursor-not-allowed');
      lt.title = 'Fixed at 24 tiles';
    }
  };

  const hidePressOut = () => {
    const el = byId('vol_press_out');
    if (el) {
      el.closest('label')?.classList.add('hidden');
      el.classList.add('hidden');
    }
  };

  // Mongo Extended JSON `_id` → string
  const idOf = (doc) => {
    const id = doc?._id;
    if (!id) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object') return id.$oid || id.$id || String(id);
    return String(id);
  };

  const dtOf = (d) => d?.datetime || d?.date || d?.createdAt || null;

  const fmtOption = (d) => {
    const dt = new Date(dtOf(d));
    const pad = (n) => String(n).padStart(2, '0');
    const label = Number.isNaN(+dt)
      ? '(no datetime)'
      : `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
    const rid = d?.recipe_id ?? '';
    const short = idOf(d).slice(0, 8);
    return `${label} — recipe ${rid}${short ? ` — ${short}` : ''}`;
  };

  // API
  const API = {
    pageAll: (limit, skip) => `/api/all/page?limit=${limit}&skip=${skip}`,
    runsPage: (limit, skip) => `/api/runs?limit=${limit}${Number.isFinite(skip) ? `&skip=${skip}` : ''}`,
  };

  const getJSON = async (url) => {
    const r = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} @ ${url}`);
    return r.json();
  };

  const fetchAllDocs = async () => {
    try {
      const size = 1000; let skip = 0; let all = [];
      for (let i = 0; i < 100; i++) {
        const page = await getJSON(API.pageAll(size, skip));
        if (!Array.isArray(page) || page.length === 0) break;
        all = all.concat(page);
        if (page.length < size) break;
        skip += size;
      }
      if (all.length) return all;
    } catch (e) {
      console.warn('Falling back to /api/runs pagination:', e);
    }
    // fallback
    const size = 200; let skip = 0; let all = [];
    for (let i = 0; i < 200; i++) {
      const page = await getJSON(API.runsPage(size, skip));
      if (!Array.isArray(page) || page.length === 0) break;
      all = all.concat(page);
      if (page.length < size) break;
      skip += size;
    }
    return all;
  };

  // fields present on the page
  const FIELDS = [
    'datetime','recipe_id','gloss_type','gloss_amount_target_g_per_tile',
    'vol_start','vol_glaze_out','vol_kiln_out','vol_sort_out',
    'target_pressure','actual_pressure','layers_tossed','desired_thickness',
    'recipe_air_cooling','recipe_moisture','recipe_air_flow','recipe_max_temp','recipe_humidity',
    'kiln_air_cooling','kiln_moisture','kiln_air_flow','kiln_max_temp','kiln_humidity',
    'delta_air_cooling','delta_moisture','delta_air_flow','delta_max_temp','delta_humidity',
    // NOTE: we intentionally skip writing 'vol_press_out' (hidden)
  ];

  const fillFromDoc = (doc) => {
    if (!doc) return;
    FIELDS.forEach((k) => {
      if (k === 'layers_tossed') { setVal('layers_tossed', 24); return; }
      setVal(k, doc[k]);
    });
    lockLayers();

    const id = idOf(doc);
    window.__currentRunId = id;
    window.__currentRunDoc = doc;

    // notify the page → it will run predict + flag evaluation
    window.dispatchEvent(new CustomEvent('cycleSelected', { detail: { id, doc } }));

    if (typeof window.predictNow === 'function') window.predictNow();
  };

  // boot
  let docs = [];
  async function start() {
    hidePressOut();
    lockLayers();
    const sel = byId('cycleSelection');
    const refreshBtn = byId('btnRefresh');
    if (!sel) return;

    async function load() {
      let all = [];
      try {
        byId('statusText') && (byId('statusText').textContent = 'Loading cycles…');
        all = await fetchAllDocs();
      } catch (e) {
        console.error(e);
        alert('Failed to load cycles from the server. Check routes and CORS.');
        return;
      }
      all.forEach(d => d.__dt = new Date(dtOf(d) || 0));
      all.sort((a, b) => b.__dt - a.__dt);
      docs = all;

      sel.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Choose a cycle…';
      placeholder.disabled = true;
      placeholder.selected = true;
      sel.appendChild(placeholder);

      docs.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = idOf(d) || String(i);
        opt.textContent = fmtOption(d);
        sel.appendChild(opt);
      });

      byId('statusText') && (byId('statusText').textContent = `${docs.length} cycles loaded`);
      if (docs.length) { sel.selectedIndex = 1; fillFromDoc(docs[0]); }
    }

    sel.addEventListener('change', () => {
      const v = sel.value;
      const doc = docs.find(d => idOf(d) === v) ?? docs[sel.selectedIndex - 1] ?? null;
      fillFromDoc(doc);
    });

    refreshBtn && refreshBtn.addEventListener('click', load);
    await load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.PortobelloLoss = {
    get currentDoc(){ return window.__currentRunDoc || null; },
    get currentRunId(){ return window.__currentRunId || null; },
    get docs(){ return docs.slice(); }
  };
})();

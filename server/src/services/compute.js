// server/services/compute.js
// Minimal compute pass that matches your fields and gives the dashboard what it needs.

export const STAGES = ['Start', 'Press', 'Glaze', 'Kiln', 'Sort'];

// basic constants (tune later)
const LBS_PER_FT2 = 5;
const KG_PER_LB   = 0.453592;
const PRESS_STARTUP_SCRAP_FT2 = 48; // when first_cycle = 1
const SORT_MIN = 0.88;

const clamp01 = (x) => Math.max(0, Math.min(1, x ?? 0));
const ft2ToKg = (ft2) => ft2 * LBS_PER_FT2 * KG_PER_LB;

export function computeDerived(row) {
  const r = { ...row };

  // Normalize / default numbers
  ['vol_start','vol_press_out','vol_glaze_out','vol_kiln_out','vol_sort_out']
    .forEach(k => r[k] = typeof r[k] === 'number' ? r[k] : null);

  const start = r.vol_start ?? 0;

  // --- PRESS ---
  const estPressOut = start - (r.first_cycle === 1 ? PRESS_STARTUP_SCRAP_FT2 : 0);
  const pressOut = r.vol_press_out ?? Math.max(0, estPressOut);
  const pressRatio = start ? clamp01(pressOut / start) : 0;

  // Enforce monotonic volumes
  r.vol_press_out = Math.min(pressOut, start);

  // --- GLAZE ---
  const glazeOut  = r.vol_glaze_out ?? r.vol_press_out ?? 0;
  const glazeRatio = r.vol_press_out ? clamp01(glazeOut / r.vol_press_out) : 0;
  r.vol_glaze_out = Math.min(glazeOut, r.vol_press_out ?? glazeOut);

  // --- KILN ---
  const kilnOut   = r.vol_kiln_out ?? Math.round((r.vol_glaze_out ?? 0) * 0.965);
  const kilnRatio = r.vol_glaze_out ? clamp01(kilnOut / r.vol_glaze_out) : 0;
  r.vol_kiln_out  = Math.min(kilnOut, r.vol_glaze_out ?? kilnOut);

  // --- SORT ---
  const sortOut   = r.vol_sort_out ?? r.vol_kiln_out ?? 0;
  const sortRatio = r.vol_kiln_out ? clamp01(sortOut / r.vol_kiln_out) : 0;
  r.vol_sort_out  = Math.min(sortOut, r.vol_kiln_out ?? sortOut);

  // Losses (ft²)
  const lossPress = Math.max(0, start               - (r.vol_press_out  ?? 0));
  const lossGlaze = Math.max(0, (r.vol_press_out??0) - (r.vol_glaze_out ?? 0));
  const lossKiln  = Math.max(0, (r.vol_glaze_out??0) - (r.vol_kiln_out  ?? 0));
  const lossSort  = Math.max(0, (r.vol_kiln_out ??0) - (r.vol_sort_out  ?? 0));

  // Overall yield
  const yieldTotal = start ? clamp01((r.vol_sort_out ?? 0) / start) : 0;

  // Basic flags (keep simple for now)
  const sortFlag = sortRatio < SORT_MIN ? 'SORT_BELOW_88' : undefined;

  return {
    ...r,
    // handy deriveds the UI/endpoints use
    stageLossKg: [
      ft2ToKg(start),            // Start inventory (for your first point)
      ft2ToKg(lossPress),
      ft2ToKg(lossGlaze),
      ft2ToKg(lossKiln),
      ft2ToKg(lossSort),
    ],
    ratios: {
      press: pressRatio,
      glaze: glazeRatio,
      kiln:  kilnRatio,
      sort:  sortRatio,
    },
    yield_total: yieldTotal,
    sort_flag: sortFlag
  };
}
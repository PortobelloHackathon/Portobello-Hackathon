⸻

# Portobello Hackathon — Smart Information Management

Team: John Herron • Jacob Hernando • Adrian Gonzalez • Kymanie Louis • Kashaina Nucum
Event: Portobello America Hackathon 2025

An AI-assisted production dashboard for tile manufacturing that turns siloed signals into actionable insights. It models and visualizes per-stage material flow (Start → Press → Glaze → Kiln → Sort), tracks KPIs, and provides interactive “what-if” analysis and live prediction walkthroughs.

⸻

✨ Features

- Live Predictions (loss_predictions.html)
  - In-browser Python (Pyodide) loads `ml_model.joblib` to predict stage ratios and minimum thresholds.
  - Drive a full cycle from historical rows in `endpoints.csv` with 10s stage reveals, pinning thresholds and flagging failures.
  - Rich tooltips, stage badges (Passed/Failed), and a flags panel for quick triage.

- What-If Simulator (what_if.html)
  - Interactive sliders for recipe setpoints and kiln measurements; computes deltas automatically.
  - Predicts per-stage volumes, shows dashed “min threshold” lines, and estimates final yield.
  - AI Insights recommends top “quick wins” by probing levers and shows one-click “Apply” buttons.
  - Falls back to a deterministic predictor if a model is missing or features don’t match.

- Analytics (analytics.html)
  - Loads `tiles.csv` and lets you scrub through timestamps to see stage volumes.
  - Multi-ring donut for remaining/loss by stage, horizontal bar of remaining %, stage cards, and final yield with delta vs. previous.
  - Timestamp picker modal, zoom controls, and “Download PNG” for charts.

- Additional pages wired in the sidebar (UI-first; content may be data/CSV-driven):
  - tables.html — All Data view
  - yield_explorer.html — Yield Explorer
  - batch_compare.html — Compare batches/runs
  - recipe_analytics.html — Recipe analytics
  - edit_recipes.html — Inline, quick edits of recipe parameters
  - model_performance.html — Model metrics overview
  - info.html — Info & How-To

- Responsive navigation sidebar (sidebar.js)
  - Desktop and mobile slide-in, active page highlight, optional badges (alerts/counters).

⸻

🧱 Tech Stack

- Frontend: HTML, Tailwind CSS, Chart.js, Pyodide (NumPy/Pandas/Scikit-learn in-browser)
- Backend: Node.js, Express, Mongoose (MongoDB)
- Data: MongoDB (local or Atlas), CSV files for demo/analysis (`tiles.csv`, `endpoints.csv`, etc.)

⸻

🚀 Quickstart

1) Backend (API)

- From repo root:
  - cd server
  - Create `.env` and set:
    - MONGODB_URI=mongodb://127.0.0.1:27017/portobello
    - PORT=4000
  - npm install
  - npm run dev   # API at http://localhost:4000

Notes:
- CORS is enabled by default.
- Root health: GET http://localhost:4000/ → { ok: true, service: 'portobello-api' }

2) Frontend (static HTML)

- Serve the repository root with a static server (so assets and CSV/model files resolve):
  - If using VS Code “Live Server”, it commonly runs at http://127.0.0.1:5500 (the headers link there).
  - Or use a simple server from the repo root:
    - npx serve -l 5500 .
  - Then open:
    - http://127.0.0.1:5500/loss_predictions.html (Live Predictions)
    - http://127.0.0.1:5500/what_if.html (What-If Simulator)
    - http://127.0.0.1:5500/analytics.html (Analytics)

Data files used by pages (place at repo root unless you change paths in HTML/JS):
- ml_model.joblib — model bundle loaded by Pyodide (both Live Predictions and What-If)
- endpoints.csv — historical rows used to simulate stage reveals on Live Predictions
- tiles.csv — time-series used by Analytics scrubber and charts
- tiles_flags_only.csv, tiles_predictions_eval.csv — optional companion CSVs for analysis pages

⸻

📂 Project Layout

Portobello-Hackathon/
├─ loss_predictions.html        # Live per-stage walkthrough (Pyodide + model)
├─ what_if.html                 # Interactive simulator + AI insights
├─ analytics.html               # CSV-driven analytics and breakdown charts
├─ tables.html, yield_explorer.html, batch_compare.html, recipe_analytics.html, edit_recipes.html, info.html
├─ loss_predictions.js          # Page helper (cycle selection, API pagination)
├─ sidebar.js                   # Responsive navigation sidebar
├─ assets/
│  ├─ css/base.css
│  ├─ images/, img/             # Logos and illustrations
│  └─ js/
│     ├─ csv.js                 # Minimal CSV parser
│     ├─ app.js, charts.js, dataStore.js, insights.js, metrics.js, ui.js (stubs/placeholders for future growth)
├─ server/
│  ├─ index.js                  # Express bootstrap, CORS, JSON, logging
│  ├─ package.json              # scripts (`dev`, `start`)
│  └─ src/
│     ├─ db.js                  # Mongoose connect helper
│     ├─ services/compute.js    # Stage math + derived fields
│     ├─ models/
│     │  ├─ Run.js              # Raw + derived metrics for a cycle
│     │  ├─ KpiSnapshot.js      # Optional KPI snapshots (yield/scrap/OnTime)
│     │  └─ LossEvent.js        # Individual loss events by stage
│     └─ routes/
│        ├─ health.js           # GET /api/health
│        ├─ runs.js             # POST /api/runs, GET /api/runs, GET /api/runs/latest
│        ├─ stats.js            # GET /api/stats/stages, GET /api/stats/dashboard
│        ├─ kpis.js             # GET /api/kpis
│        ├─ loss.js             # GET /api/loss/breakdown
│        └─ routes.js           # (optional) streaming/page endpoints for all runs
└─ docs/
   └─ README.md                 # You’re here

⸻

🔌 API Endpoints (cheat sheet)

Base: http://localhost:4000

- POST /api/runs → ingest one run; backend computes stage losses, ratios, yield.
- GET  /api/runs?limit=50 → recent runs (default limit 50, max 200).
- GET  /api/runs/latest → most recent run.
- GET  /api/stats/stages → { stages, lossKg, statuses } for the line chart.
- GET  /api/stats/dashboard → KPIs + loss breakdown + startKg.
- GET  /api/kpis → { yieldPct, scrapPct, onTimePct }.
- GET  /api/loss/breakdown → donut data { labels, pct }.
- GET  /api/health → service + db status.

Optional (wire if needed):
- GET  /api/all → stream all Run documents as a single JSON array (chunked).
- GET  /api/all/page?limit=200&skip=0&sort=desc → paginated all-runs.

Sample cURL

# Create a run
curl -X POST http://localhost:4000/api/runs \
  -H "Content-Type: application/json" \
  -d '{
    "datetime":"2025-10-16T16:00:00Z",
    "vol_start":60000,
    "pressure_psi":2050,
    "first_cycle":0,
    "vol_press_out":59000,
    "vol_glaze_out":58000,
    "vol_kiln_out":56000,
    "vol_sort_out":52000,
    "recipe_id":246,
    "cooling_profile":2,
    "thickness_mm":9
  }'

Fetch dashboard snapshots

curl http://localhost:4000/api/stats/stages
curl http://localhost:4000/api/stats/dashboard

⸻

🧠 Data Model (simplified)

Run (server/src/models/Run.js)

- Raw fields:
  - datetime, vol_start, vol_press_out, vol_glaze_out, vol_kiln_out, vol_sort_out
  - pressure_psi, first_cycle, recipe_id, cooling_profile, thickness_mm
  - plus various process fields used by the UI/model (max_temp, moisture_pct, air_flow_top_setting, air_cooling, external_humidity, etc.)

- Derived fields (set by services/compute.js on ingest):
  - stageLossKg: [startKg, pressLossKg, glazeLossKg, kilnLossKg, sortLossKg]
  - ratios: { press, glaze, kiln, sort }  // 0..1 per-stage retention
  - yield_total: Number                   // overall retention 0..1
  - sort_flag: String                     // e.g., SORT_BELOW_88

KpiSnapshot (optional) and LossEvent are available for historical KPI snapshots and discrete loss events.

⸻

🧮 How compute works (services/compute.js)

- Normalizes stage volumes and enforces monotonic flow (cannot exceed previous stage).
- Estimates missing values with simple rules where appropriate.
- Computes per-stage losses (ft² → kg), per-stage ratios, overall yield, and basic flags.

⸻

🧪 Demo data & model bundle

- Place `ml_model.joblib` at repo root. Both Live Predictions and What-If will load it via Pyodide.
- Place `endpoints.csv` and `tiles.csv` at repo root (or update paths in the pages).
- If the model bundle lacks expected features, pages automatically fall back to a deterministic predictor so the UI remains functional.

⸻

🛠️ Dev Tips & Troubleshooting

- Port in use (EADDRINUSE:4000): another API instance is running. Kill it or change PORT in `.env`.
- Mongo URI: prefer `127.0.0.1` over `localhost` on recent Node versions.
- Static server: serve the repo root so relative paths to CSV/model files resolve.
- /api/all endpoints: mount `server/src/routes/routes.js` under `/api/all` if you need streaming/pagination for “all runs”. The Live Predictions page auto-falls back to `/api/runs` if `/api/all` isn’t mounted.

⸻

🤝 Team
	•	John Herron
	•	Jacob Hernando
	•	Adrian Gonzalez
	•	Kymanie Louis
	•	Kashaina Nucum

⸻

📜 License

MIT — do anything, just keep the notice.

⸻

✅ What’s next (nice-to-haves)

- Serve static UI from Express (single-port deploy).
- CSV/ETL endpoint (POST /api/runs/bulk) to ingest batches.
- Auth + roles (operator vs. supervisor views).
- Alerts on stage anomalies (z-score or simple thresholds).

⸻
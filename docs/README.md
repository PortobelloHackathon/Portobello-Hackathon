⸻

Portobello Hackathon — Smart Information Management

Team: John Herron • Jacob Hernando • Adrian Gonzalez • Kymanie Louis • Kashaina Nucum
Event: Portobello America Hackathon 2025

A lightweight, fast-to-deploy AI-assisted production dashboard that turns siloed factory signals into actionable insights: per-stage material loss, KPIs, and a clean visual of where waste happens across the flow.

⸻

✨ What it does
	•	Analytics page
	•	Line chart of loss per stage across the process (Start → Press → Glaze → Kiln → Sort) with status-aware coloring.
	•	Loss breakdown donut and a mini “% remaining” bar panel for quick sense-making.
	•	Optional CSV timestamp picker for exploring historical snapshots.
	•	Simple API
	•	POST a single run; backend computes stage deltas, ratios, and yield.
	•	GET endpoints feed the dashboard in two calls (/stats/stages, /stats/dashboard).

⸻

🧱 Tech Stack

Frontend: HTML, Tailwind CSS, Chart.js
Backend: Node.js, Express, Mongoose (MongoDB)
Data: MongoDB (local or Atlas); optional CSV exploration in the UI

⸻

🚀 Quickstart

1) Backend (API)

cd server
cp .env.example .env   # then edit it (see below)
npm install
npm run dev            # starts API at http://localhost:4000

.env example

MONGODB_URI=mongodb://127.0.0.1:27017/portobello
PORT=4000

2) Frontend

This project ships as static HTML. Open index.html in a Live Server, or run a tiny static server from the repo root:

# from repo root (NOT server/)
npx serve .
# then open the printed URL and navigate to /index.html

If the frontend and backend are on different ports, CORS is already enabled on the API.

⸻

📂 Project Layout

Portobello-Hackathon/
├─ index.html                # dashboard UI (Analytics)
├─ inventory.html            # (optional) second tab
├─ assets/                   # images, logos, CSV demo (tiles6.csv)
└─ server/
   ├─ index.js               # Express bootstrap
   ├─ package.json           # scripts (`dev`, `start`)
   └─ src/
      ├─ db.js               # mongoose connect helper
      ├─ models/
      │  └─ Run.js           # run schema + compute fields
      └─ routes/
         ├─ runs.js          # POST /api/runs, GET /api/runs/latest
         ├─ stats.js         # GET /api/stats/stages, /api/stats/dashboard
         ├─ kpis.js          # GET /api/kpis
         └─ loss.js          # GET /api/loss/breakdown


⸻

🔌 API Endpoints (cheat sheet)

Method	Endpoint	Purpose
POST	/api/runs	Ingest one run; computes stage deltas, ratios, and yield.
GET	/api/runs/latest	Fetch the most recent run for quick verification.
GET	/api/stats/stages	Data for the line chart: stages[], lossKg[], statuses[].
GET	/api/stats/dashboard	KPIs (yieldPct, scrapPct, onTimePct) + loss breakdown + start mass.
GET	/api/kpis	KPIs only (lightweight polling).
GET	/api/loss/breakdown	Loss breakdown only (donut data).

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

# Dashboard data
curl http://localhost:4000/api/stats/stages
curl http://localhost:4000/api/stats/dashboard


⸻

🧠 Data Model (simplified)

Run documents store raw stage volumes plus computed fields:

{
  datetime, vol_start, vol_press_out, vol_glaze_out, vol_kiln_out, vol_sort_out,
  pressure_psi, first_cycle, recipe_id, cooling_profile, thickness_mm,
  stageLossKg: [startKg, pressLossKg, glazeLossKg, kilnLossKg, sortLossKg],
  ratios: { press, glaze, kiln, sort },    // 0..1 stage-to-stage
  yield_total: Number                      // overall (0..1)
}


⸻

🛠️ Dev Tips & Troubleshooting
	•	Port in use (EADDRINUSE:4000):
	•	You have another API instance running. Kill it or change PORT in .env.
	•	Mongo URI error:
Use the full scheme: mongodb://127.0.0.1:27017/portobello (prefer 127.0.0.1 over localhost on recent Node versions).
	•	CSV exploration in UI:
Put your sample CSV as assets/tiles6.csv (or update the path in index.html). The modal lets you pick a timestamp and preview charts.
	•	Merge conflicts:
If you see <<<<<<< HEAD markers, resolve the block, remove markers, git add <file>, then git commit.

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
	•	Serve static UI from Express (app.use(express.static(...))) for a single-port deploy.
	•	CSV/ETL endpoint (POST /api/runs/bulk) to ingest batches.
	•	Auth + roles (operator vs. supervisor views).
	•	Alerts on stage anomalies (z-score or simple thresholds).

⸻
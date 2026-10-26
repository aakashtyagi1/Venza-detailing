# VENZA • BRING IT DIRTY | Icon of Luxury Automotive Detail & CRM Atelier

A complete, fully functional full-stack luxury car detailing and client reservation management platform inspired by elite automotive detailing laboratories (featuring Porsche 911 GT3 RS, McLaren, and Ferrari bespoke commissions).

---

## 🌟 Core Features & Responsive Design

1. **360° Atelier Motorized Turntable & Defect Simulator:**
   - Smooth, calibrated, touch-friendly 360-degree rotation across desktop (mouse) and mobile (touch gestures).
   - Motorized auto-spin sequence (`▶ AUTO-ROTATE 360°`), speed controls (`1x` / `2x`), step buttons (`⟲ -15°`, `+15° ⟳`), and interactive 360° angle slider.
   - 3D perspective floor turntable platter with rotating azimuth markings and dynamic optical light sweeps.

2. **Interactive "Scroll-to-Wash" Section:**
   - Split-comparison slider to watch endurance race mud, road salt, and swirl defects transform into 10H liquid glass reflection.
   - Interactive defect hotspots (swirl marks, iron fallout, brake dust sintering).
   - Real-time diagnostic telemetry HUD (Gloss meter `32.4 GU` → `98.4 GU`, clear coat `+28µ`).

3. **Interactive Booking Drawer / Modal:**
   - Slide-out reservation engine with service packages (Exterior Decon Wash, Stage-2 Paint Correction, 10H Ceramic Armor).
   - Vehicle specifications, paint condition selector, and bespoke add-ons with real-time live price calculation.
   - Booking confirmation state (`"YOU'RE BOOKED, DANIEL."`) with confetti celebration, unique reference ID (`BID-XXXX`), and CRM sync.

4. **Authentication & Admin CRM Leads Dashboard:**
   - Secure login modal (`"WELCOME BACK, ADMIN"` with 1-click demo access).
   - Live leads data table with inline status dropdowns (`NEW LEAD`, `SCHEDULED`, `IN PROGRESS`, `COMPLETED`, `CANCELLED`), client dossier modal, KPI telemetry cards, and CSV export.

---

## 💻 Tech Stack
- **Frontend:** React 18, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, Web Audio API sound synthesizers.
- **Backend:** Node.js, Express, Persistent JSON/SQLite database layer with atomic writes and Vercel `/tmp` + memory fallbacks.
- **Deployment Ready:** Vercel serverless configuration (`vercel.json` + `api/index.js`), Vite production bundles.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run both backend API (port 5000) and Vite frontend (port 3000) concurrently:
npm run dev
```

Visit: **http://localhost:3000** (or **http://localhost:5000**)

### Admin Credentials
- **Username:** `admin`
- **Password:** `admin123` *(or click the "One-Click Demo Admin Login" button in the modal)*

---

## 📦 GitHub Push Commands

To initialize git and push this project to your newly created GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files (excluding node_modules and dist via .gitignore)
git add .

# 3. Commit your code
git commit -m "feat: complete Venza Bring It Dirty luxury car detailing full-stack app"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your repository URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Deploying to Vercel (Production)

This repository includes a preconfigured `vercel.json` and `api/index.js` serverless function handler.

### Option A: Deploy via GitHub (Recommended)
1. Push your code to GitHub using the commands above.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New"** > **"Project"**.
4. Import your newly pushed GitHub repository.
5. Vercel will automatically detect the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click **"Deploy"**. Vercel will build and deploy the entire full-stack app in seconds!

### Option B: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Deploy directly from your terminal
vercel

# 3. Deploy to production
vercel --prod
```

---

## 📡 API Endpoints Overview
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & system telemetry |
| `GET` | `/api/leads` | List CRM leads (supports `?status=...&search=...`) |
| `POST` | `/api/leads` | Create new client reservation / lead |
| `PATCH` | `/api/leads/:id` | Update lead status (`NEW LEAD`, `SCHEDULED`, `IN PROGRESS`, `COMPLETED`, `CANCELLED`) |
| `DELETE` | `/api/leads/:id` | Remove a lead from the CRM |
| `GET` | `/api/stats` | KPI statistics (total revenue, active cleanroom bays, average ticket) |
| `POST` | `/api/auth/login` | Admin authentication endpoint |
| `POST` | `/api/leads/seed` | Reset database to initial VIP seed reservations |

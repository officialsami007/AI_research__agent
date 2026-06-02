# 🔍 Autonomous Research Agent — AI-Powered Research & Report Generation

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge)

**Enter any research topic and receive a fully structured, AI-generated report — backed by real web sources, credibility analysis, and multi-stage reasoning.**

[🚀 Live Demo](https://ai-research-agent-x0il.onrender.com/) · [📖 How It Works](#how-it-works) · [⚙️ Local Setup](#local-setup) · [🏗️ Architecture](#architecture)

</div>

---

## Overview

Autonomous Research Agent is a full-stack AI application that automates the research process end-to-end. Given a topic, the agent independently plans its research strategy, searches the web for relevant sources, evaluates the credibility of each result, and synthesizes everything into a professional, structured report.

The pipeline is driven by **Llama 3.3 70B** via OpenRouter for reasoning and report generation, and **Serper API** for real-time Google search results. Rather than a single prompt-and-response pattern, the agent runs through four distinct reasoning stages — making it closer to an autonomous workflow than a standard chatbot.

The application is containerized with **Docker** and deployed on **Render**, with a React + Tailwind CSS frontend that renders the final report in a clean, readable format.

---

## Live Demo

🌐 **[https://ai-research-agent-x0il.onrender.com/](https://ai-research-agent-x0il.onrender.com/)**

> Hosted on Render's free tier. If the page takes ~30 seconds to load, the server is waking from sleep — this is expected behaviour on free-tier hosting.

---

## Features

- **4-Stage Autonomous Pipeline** — Planning → Searching → Analyzing → Reporting, each handled as a distinct reasoning step
- **Real-Time Web Search** — Serper API fetches live Google search results for every research topic
- **Credibility Scoring** — The agent evaluates and scores each source for relevance and reliability before including it in the report
- **Structured Report Generation** — Llama 3.3 70B synthesizes findings into a professional, well-organized report with cited sources
- **React + Tailwind Frontend** — Clean, responsive UI that renders the final report with formatted sections and source references
- **REST API Backend** — Flask backend exposing clearly defined endpoints for health checks and research requests
- **Dockerized** — Fully containerized for consistent local development and cloud deployment

---

## How It Works

### The 4-Stage Agent Pipeline

```
User enters a research topic
            │
            ▼
  ┌──────────────────┐
  │  STAGE 1: Plan   │  Llama generates a set of targeted search queries
  └────────┬─────────┘  based on the topic to maximize source coverage
           │
           ▼
  ┌──────────────────┐
  │ STAGE 2: Search  │  Serper API fetches real-time Google search results
  └────────┬─────────┘  for each generated query
           │
           ▼
  ┌───────────────────┐
  │ STAGE 3: Analyze  │  Llama scores each source for credibility,
  └────────┬──────────┘  relevance, and quality — filters weak results
           │
           ▼
  ┌───────────────────┐
  │ STAGE 4: Report   │  Llama synthesizes all findings into a structured
  └────────┬──────────┘  professional report with citations
           │
           ▼
   Report displayed in frontend ✓
```

### Pipeline Stages in Detail

| Stage | Agent Action | Technology |
|---|---|---|
| **Planning** | Breaks topic into specific search queries for maximum coverage | Llama 3.3 70B via OpenRouter |
| **Searching** | Executes queries and retrieves real-time Google results | Serper API |
| **Analyzing** | Scores each source on credibility and relevance, filters low-quality results | Llama 3.3 70B via OpenRouter |
| **Reporting** | Synthesizes all credible findings into a structured, cited report | Llama 3.3 70B via OpenRouter |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **LLM** | Llama 3.3 70B via OpenRouter API |
| **Web Search** | Serper API — real-time Google search results |
| **Backend** | Flask, Python 3.10+ |
| **Frontend** | React 18, Tailwind CSS |
| **Containerization** | Docker |
| **Hosting** | Render (free tier) |

---

## Architecture

```
autonomous-research-agent/
│
├── app.py                 # Flask backend — API endpoints + agent pipeline
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container definition
├── .env                   # API keys (never committed)
├── .env.example           # API key template
│
├── package.json           # React dependencies
└── src/
    ├── App.jsx            # Main React component — UI + report rendering
    ├── index.js           # React entry point
    └── index.css          # Global styles (Tailwind)
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — confirms backend is running |
| `POST` | `/api/research` | Submit a topic, runs the full 4-stage pipeline, returns report |

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [OpenRouter API key](https://openrouter.ai) — for Llama 3.3 70B access
- A free [Serper API key](https://serper.dev) — for web search
- [Docker](https://www.docker.com/products/docker-desktop/) (optional — for containerized setup)

### Step 1 — Get Your API Keys

**OpenRouter (LLM):**
1. Go to [openrouter.ai](https://openrouter.ai) → Sign up free
2. Navigate to **API Keys** → Create a new key
3. Copy the key

**Serper (Web Search):**
1. Go to [serper.dev](https://serper.dev) → Sign up free
2. Copy your API key from the dashboard

### Step 2 — Configure Environment Variables

Open `.env` and add your keys:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
SERPER_API_KEY=your_serper_key_here
```

### Step 3 — Run the Backend

**Option A — Python directly:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

**Option B — Docker:**

```bash
# Build the image
docker build -t research-agent .

# Run the container
docker run -p 5000:5000 --env-file .env research-agent
```

Backend runs at **http://localhost:5000** — verify with `/api/health`.

### Step 4 — Run the Frontend

```bash
# In a separate terminal
npm install
npm start
```

Frontend runs at **http://localhost:3000** and opens automatically.

### Step 5 — Use the App

1. Open **http://localhost:3000**
2. Type any research topic
3. Click **Research**
4. The agent runs through all 4 stages and displays the final report

---

## Deployment

### Backend → Render

1. Push the repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects the `Dockerfile` — leave settings as default
5. Add environment variables:
   - `OPENROUTER_API_KEY` = your key
   - `SERPER_API_KEY` = your key
6. Deploy — you will receive a `*.onrender.com` URL

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Can't reach backend` | Make sure `python app.py` is running in a separate terminal |
| `API key invalid` | Re-copy the key directly from the provider dashboard |
| `npm not found` | Install Node.js from [nodejs.org](https://nodejs.org) |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` with venv activated |
| Render backend sleeps | Free tier sleeps after 15 min — first request takes ~30s to wake |

---

<div align="center">
Built with Flask · React · Tailwind CSS · Llama 3.3 70B · Serper API · Docker
</div>

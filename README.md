
Step 1: Get API Keys
1. OpenRouter : https://openrouter.ai → Sign up, then Copy API key
2. Brave Search : https://api.search.brave.com → Sign up → Copy API key

### Step 2: Edit .env File
Open `.env` file and replace:
```
OPENROUTER_API_KEY=your_actual_key_here
BRAVE_SEARCH_API_KEY=your_actual_key_here
```

### Step 3: Backend (Terminal 1)
```bash
# Windows:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# macOS/Linux:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Expected: `Running on http://localhost:5000`

### Step 4: Frontend (Terminal 2)
```bash
npm install
npm start
```
Expected: Opens http://localhost:3000 automatically

### Step 5: Use It!
- Type a research topic
- Click "Research"
- Get professional report!

---

## 📊 What's Inside

- **Backend**: Flask + Python (app.py)
- **Frontend**: React + Tailwind CSS
- **AI Model**: Llama 3.3 70B (via OpenRouter)
- **Search**: Brave Search API
- **4-Stage Pipeline**: Plan → Search → Analyze → Report

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| "Can't reach backend" | Make sure `python app.py` is running |
| "API key invalid" | Copy key directly from website again |
| "npm not found" | Install Node.js from nodejs.org |
| "ModuleNotFoundError" | Run: `pip install -r requirements.txt` |

---

## 📁 Folder Structure

```
autonomous-research-agent/
├── app.py                 ← Backend
├── requirements.txt       ← Python packages
├── .env                   ← Your API keys
├── package.json          ← React packages
├── src/
│   ├── App.jsx           ← Frontend
│   ├── index.js
│   └── index.css
├── public/
│   └── index.html
└── venv/                 ← Auto-created
```

---

## 🎯 How It Works

```
You type topic
     ↓
Backend receives
     ↓
STAGE 1: Planning → Llama generates search queries
     ↓
STAGE 2: Searching → Brave finds articles
     ↓
STAGE 3: Analyzing → Llama scores credibility
     ↓
STAGE 4: Reporting → Llama synthesizes report
     ↓
Frontend displays beautiful report
```

---

## ✅ Verification

1. Backend health: http://localhost:5000/api/health → should show `{"status":"ok"}`
2. Frontend loads: http://localhost:3000 → should see UI
3. Can type topic and click Research
4. Report displays with findings and sources

---

## 💡 Pro Tips

- First research is slower (rate limiting), subsequent ones are faster
- Be specific with topics (works better than generic ones)
- Check source credibility scores
- Export JSON for custom analysis

---

## 🎓 For Interviews (Deriv & Others)

This project demonstrates:
- ✅ Agentic AI systems (autonomous planning & execution)
- ✅ Tool orchestration (API coordination)
- ✅ RAG implementation (retrieval + augmentation + generation)
- ✅ Production thinking (error handling, quality control)
- ✅ Full-stack development (backend + frontend)

---

**You're all set! Start researching! 🚀**

Questions? Check troubleshooting section or review architecture above.

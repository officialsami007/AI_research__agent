from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv
import requests

load_dotenv()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# static_folder=None disables Flask's built-in /static route — we handle everything ourselves
app = Flask(__name__, static_folder=None)
CORS(app)

# Points to the 'build/' folder copied in by Docker
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_DIR = os.path.join(BASE_DIR, "build")


# ============================================
# STAGE 1: RESEARCH PLANNER (Using Groq)
# ============================================
def stage1_planning(topic):
    print(f"[STAGE 1] Planning research strategy for: {topic}")
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise Exception("GROQ_API_KEY not found. Get it from https://console.groq.com")

    prompt = f"""You are a research strategist. 
    
Topic: {topic}

Generate exactly 5 specific, targeted search queries that would comprehensively research this topic.
Format as JSON array of strings only.
Example output: ["query1", "query2", "query3", "query4", "query5"]

Return ONLY the JSON array, no other text."""

    response = requests.post(
        url="https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
        json={"model": GROQ_MODEL, "messages": [{"role": "user", "content": prompt}], "max_tokens": 500, "temperature": 0.7}
    )

    if response.status_code != 200:
        raise Exception(f"Groq API error: {response.text}")

    queries_text = response.json()['choices'][0]['message']['content'].strip()
    if queries_text.startswith("```"):
        queries_text = queries_text.split("```")[1].replace("json", "").strip()

    queries = json.loads(queries_text)
    print(f"✓ Generated search queries: {queries}")
    return queries


# ============================================
# STAGE 2: WEB SEARCH (Using Serper Free API)
# ============================================
def stage2_searching(queries):
    print(f"[STAGE 2] Searching for articles...")
    articles = []
    serper_key = os.getenv("SERPER_API_KEY")

    if not serper_key:
        print("⚠️  SERPER_API_KEY not found, using demo data")
        for query in queries:
            for i in range(3):
                articles.append({
                    "title": f"Article about {query} - Result {i+1}",
                    "url": f"https://example.com/article-{len(articles)}",
                    "snippet": f"This article provides important insights about {query}",
                    "source": ["NewsNow", "ResearchGate", "Medium"][i % 3]
                })
        return articles[:15]

    for query in queries:
        try:
            response = requests.post(
                "https://google.serper.dev/search",
                headers={"X-API-KEY": serper_key, "Content-Type": "application/json"},
                params={"q": query, "num": 5},
                timeout=20
            )
            if response.status_code == 200:
                for result in response.json().get('organic', [])[:5]:
                    articles.append({
                        "title": result.get('title', 'Untitled'),
                        "url": result.get('link', ''),
                        "snippet": result.get('snippet', 'No snippet available'),
                        "source": result.get('domain', 'Unknown')
                    })
            else:
                articles.append({"title": f"Research on {query}", "url": f"https://example.com/?q={query}", "snippet": f"Important findings about {query}", "source": "Research Database"})
        except Exception as e:
            print(f"Search exception: {e}")
            articles.append({"title": f"Article: {query}", "url": f"https://example.com/?topic={query}", "snippet": f"Key information about {query}", "source": "Demo Source"})

    print(f"✓ Found {len(articles)} articles")
    return articles[:20]


# ============================================
# STAGE 3: ANALYZING SOURCES (Using Groq)
# ============================================
def stage3_analyzing(articles, topic):
    print(f"[STAGE 3] Analyzing {len(articles)} articles...")
    groq_key = os.getenv("GROQ_API_KEY")
    analyzed = []

    for article in articles[:10]:
        prompt = f"""Analyze this article:
Title: {article['title']}
Source: {article['source']}
Description: {article.get('snippet', 'No description')}

Return ONLY valid JSON (no markdown):
{{"key_claims": ["claim1", "claim2"], "evidence": "fact or statistic", "credibility_score": 7, "relevance_score": 8, "main_topic": "focus"}}"""

        try:
            response = requests.post(
                url="https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                json={"model": GROQ_MODEL, "messages": [{"role": "user", "content": prompt}], "max_tokens": 300, "temperature": 0.5}
            )
            analysis_text = response.json()['choices'][0]['message']['content'].strip()
            if analysis_text.startswith("```"):
                analysis_text = analysis_text.split("```")[1].replace("json", "").strip()
            analysis = json.loads(analysis_text)
        except Exception as e:
            print(f"Analysis error: {e}")
            analysis = {"key_claims": ["Key insights from source"], "evidence": "Supporting information", "credibility_score": 6, "relevance_score": 7, "main_topic": article['title']}

        analyzed.append({"article": article, "analysis": analysis})

    print(f"✓ Analyzed {len(analyzed)} articles")
    return analyzed


# ============================================
# STAGE 4: GENERATING REPORT (Using Groq)
# ============================================
def stage4_reporting(topic, analyzed_articles):
    print(f"[STAGE 4] Generating report...")
    groq_key = os.getenv("GROQ_API_KEY")

    sources_summary = [{"title": i['article']['title'], "source": i['article']['source'], "credibility": i['analysis'].get('credibility_score', 7), "claim": i['analysis'].get('key_claims', [''])[0]} for i in analyzed_articles]

    prompt = f"""You are a professional research report writer.
Topic: {topic}
Sources: {json.dumps(sources_summary[:5], indent=2)}

Return ONLY this JSON (no markdown):
{{"executive_summary": "2-3 sentence summary", "key_findings": [{{"title": "Finding 1", "description": "detail", "evidence": "evidence"}}, {{"title": "Finding 2", "description": "detail", "evidence": "evidence"}}, {{"title": "Finding 3", "description": "detail", "evidence": "evidence"}}], "conclusions": "final thoughts"}}"""

    try:
        response = requests.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
            json={"model": GROQ_MODEL, "messages": [{"role": "user", "content": prompt}], "max_tokens": 1500, "temperature": 0.7}
        )
        report_text = response.json()['choices'][0]['message']['content'].strip()
        if report_text.startswith("```"):
            report_text = report_text.split("```")[1].replace("json", "").strip()
        report = json.loads(report_text)
    except Exception as e:
        print(f"Report generation error: {e}")
        report = {
            "executive_summary": f"Comprehensive research on {topic}.",
            "key_findings": [{"title": "Key Finding", "description": "Research shows important trends", "evidence": "Based on multiple sources"}],
            "conclusions": "Further research is recommended."
        }

    report['sources'] = [{"title": i['article']['title'], "url": i['article']['url'], "source": i['article']['source'], "credibility_score": min(10, max(1, i['analysis'].get('credibility_score', 7)))} for i in analyzed_articles]

    print(f"✓ Report generated")
    return report


# ============================================
# API ENDPOINTS
# ============================================
@app.route('/api/research', methods=['POST'])
def research():
    try:
        data = request.json
        topic = data.get('topic', '').strip()
        if not topic:
            return jsonify({"error": "Topic is required"}), 400
        if len(topic) < 3:
            return jsonify({"error": "Topic must be at least 3 characters"}), 400

        print(f"\n{'='*60}\n🔍 Starting research: {topic}\n{'='*60}\n")

        search_queries = stage1_planning(topic)
        articles = stage2_searching(search_queries)
        analyzed = stage3_analyzing(articles, topic)
        report = stage4_reporting(topic, analyzed)

        print(f"\n{'='*60}\n✅ Research completed!\n{'='*60}\n")
        return jsonify(report), 200

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend is running", "build_exists": os.path.isdir(BUILD_DIR)}), 200


# ============================================
# SERVE REACT FRONTEND
# CRA build structure:
#   build/index.html
#   build/static/js/main.xxx.js
#   build/static/css/main.xxx.css
# ============================================

# Serve JS/CSS/media from build/static/
@app.route('/static/<path:filename>')
def serve_static_assets(filename):
    return send_from_directory(os.path.join(BUILD_DIR, 'static'), filename)

# Serve other root-level files (manifest.json, favicon.ico, etc.)
@app.route('/<path:filename>')
def serve_root_files(filename):
    filepath = os.path.join(BUILD_DIR, filename)
    if os.path.exists(filepath) and os.path.isfile(filepath):
        return send_from_directory(BUILD_DIR, filename)
    # Not a real file — return index.html for React Router
    return send_file(os.path.join(BUILD_DIR, 'index.html'))

# Root
@app.route('/')
def serve_index():
    return send_file(os.path.join(BUILD_DIR, 'index.html'))


# ============================================
# RUN
# ============================================
if __name__ == '__main__':
    print("🚀 Autonomous Research Agent Backend Starting...")
    print(f"📁 Build dir: {BUILD_DIR} ({'EXISTS' if os.path.isdir(BUILD_DIR) else 'NOT FOUND'})")
    print("📍 Running on http://localhost:5000")
    app.run(debug=True, port=5000)
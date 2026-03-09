# ╔══════════════════════════════════════════════════════════════╗
# ║  STAGE 1 — Build the React frontend (Create React App)      ║
# ╚══════════════════════════════════════════════════════════════╝
FROM node:20-slim AS frontend-build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js postcss.config.js ./

# Empty string = relative URLs (/api/research) — hits same Flask server
ENV REACT_APP_API_URL=""

RUN npm run build
# Output: /frontend/build/


# ╔══════════════════════════════════════════════════════════════╗
# ║  STAGE 2 — Python Flask backend + serve built frontend      ║
# ╚══════════════════════════════════════════════════════════════╝
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# gunicorn is the production WSGI server (replaces Flask dev server)
RUN pip install --no-cache-dir gunicorn

COPY app.py .

# Copy built React app into Flask's static folder
COPY --from=frontend-build /frontend/build ./static

EXPOSE 5000

# Use gunicorn for production (not Flask dev server)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]

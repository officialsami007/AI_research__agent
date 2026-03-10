FROM node:20-slim AS frontend-build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js postcss.config.js ./

ENV REACT_APP_API_URL=""

RUN npm run build


FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

COPY app.py .

# Copy into 'build/' NOT 'static/' — avoids conflict with Flask's built-in /static route
COPY --from=frontend-build /frontend/build ./build

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]

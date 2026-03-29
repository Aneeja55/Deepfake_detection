# Final deployment for Hugging Face Spaces (Docker)

# 1. Build the React frontend
FROM node:18-alpine AS build-frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Hugging Face Spaces usually serves on port 7860
# Points frontend to the backend running on the same container
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# 2. Build the Python backend and final image
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy backend and install requirements
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend to nginx path
COPY --from=build-frontend /frontend/build /usr/share/nginx/html

# Build nginx config for serving frontend and proxying /api to backend
RUN echo 'server { \
    listen 7860; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://127.0.0.1:8000/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/sites-available/default && \
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create startup script
RUN echo '#!/bin/bash\n\
nginx\n\
uvicorn app:app --host 127.0.0.1 --port 8000' > /app/run.sh && \
chmod +x /app/run.sh

EXPOSE 7860
CMD ["/app/run.sh"]

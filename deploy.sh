#!/bin/bash

# --- SETUP SCRIPT FOR AWS EC2 UBUNTU ---
# Usage: ./deploy.sh [SERVER_IP]

SERVER_IP=$1

if [ -z "$SERVER_IP" ]; then
    echo "Usage: ./deploy.sh [SERVER_IP]"
    echo "ERROR: Please provide your EC2 Public IP address."
    exit 1
fi

echo "🚀 Starting Deepfake Detection App Deployment..."

# 1. Update and Install Docker/Compose if not present
echo "📦 Installing Docker and Docker-Compose..."
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 2. Cleanup old containers
echo "🧹 Cleaning up existing containers..."
docker-compose down --remove-orphans

# 3. Update the API URL in docker-compose.yml
# We use sed to replace the placeholder or current IP with the new one
echo "🔗 Updating API URL to http://$SERVER_IP:8000..."
sed -i "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=http://$SERVER_IP:8000|g" docker-compose.yml

# 4. Build and Launch
echo "🏗️ Building and Launching Containers (this may take a few minutes)..."
docker-compose up -d --build

echo "-------------------------------------------------------"
echo "✅ DEPLOYMENT COMPLETE!"
echo "-------------------------------------------------------"
echo "Frontend: http://$SERVER_IP"
echo "Backend:  http://$SERVER_IP:8000"
echo "-------------------------------------------------------"
echo "Note: Ensure your EC2 Security Group allows ports 80 and 8000."

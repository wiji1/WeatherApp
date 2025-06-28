#!/bin/bash

set -e

# Load environment variables from backend/.env if it exists
if [ -f "backend/.env" ]; then
    set -a
    source backend/.env
    set +a
fi

PROJECT_ID=${PROJECT_ID:-""}
REGION=${REGION:-"us-central1"}
BACKEND_SERVICE="weather-app-backend"
FRONTEND_SERVICE="weather-app-frontend"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI not installed"
    exit 1
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID environment variable is required"
    echo "Set it in backend/.env or export PROJECT_ID=your-project-id"
    exit 1
fi

echo "Setting project: $PROJECT_ID, region: $REGION"
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

echo "Enabling APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

if [ ! -f "backend/.env" ]; then
    echo "Error: backend/.env file not found"
    exit 1
fi

echo "Building backend..."
gcloud builds submit ./backend --tag gcr.io/$PROJECT_ID/weather-app-backend:$TIMESTAMP

echo "Deploying backend..."
gcloud run deploy $BACKEND_SERVICE \
  --image gcr.io/$PROJECT_ID/weather-app-backend:$TIMESTAMP \
  --region=$REGION \
  --port=8080 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,DB_HOST=$DB_HOST,DB_PORT=$DB_PORT,DB_USER=$DB_USER,DB_PASSWORD=$DB_PASSWORD,DB_NAME=$DB_NAME,OPENWEATHER_API_KEY=$OPENWEATHER_API_KEY" \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=100 \
  --execution-environment=gen2

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
echo "Backend URL: $BACKEND_URL"

echo "Building frontend..."
cat > frontend/cloudbuild.yaml << EOF
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/$PROJECT_ID/weather-app-frontend:$TIMESTAMP', '--build-arg', 'VITE_API_URL=$BACKEND_URL', '.']
images:
- 'gcr.io/$PROJECT_ID/weather-app-frontend:$TIMESTAMP'
EOF

gcloud builds submit ./frontend --config=frontend/cloudbuild.yaml
rm frontend/cloudbuild.yaml

echo "Deploying frontend..."
gcloud run deploy $FRONTEND_SERVICE \
  --image gcr.io/$PROJECT_ID/weather-app-frontend:$TIMESTAMP \
  --region=$REGION \
  --port=80 \
  --allow-unauthenticated \
  --set-env-vars="VITE_API_URL=$BACKEND_URL" \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=100 \
  --execution-environment=gen2

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")

echo "Deployment complete"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
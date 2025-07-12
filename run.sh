#!/bin/bash

# Data Query Assistant - Docker Runner Script

echo "🚀 Starting Data Query Assistant..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp server/env.example .env
    echo "⚠️  Please edit .env file and add your Groq API key before running the app."
    echo "   You can get a free API key from: https://console.groq.com/keys"
    exit 1
fi

# Check if GROQ_API_KEY is set
if ! grep -q "GROQ_API_KEY=gsk_" .env; then
    echo "⚠️  Warning: Groq API key not found in .env file."
    echo "   The app will work for file uploads but AI queries will fail."
    echo "   Add your API key to the .env file to enable AI features."
    echo "   Get your free API key from: https://console.groq.com/keys"
fi

echo "🔧 Building and starting the application..."
docker-compose up --build

echo "✅ Application is starting..."
echo "🌐 Open your browser and go to: http://localhost:3001"
echo "📁 You can upload the sample-data.csv file to test the app" 
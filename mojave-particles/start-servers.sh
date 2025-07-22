#!/bin/bash

echo "🚀 Starting Mojave Particles Development Environment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the mojave-particles directory."
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo "✅ Found package.json in correct directory"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Stop any existing servers
echo "🔄 Stopping any existing servers..."
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start the development server in the background
echo "🌐 Starting development server (https://localhost:5173)..."
npm run dev &
DEV_PID=$!
sleep 5

# Check if dev server started successfully (try multiple ports)
DEV_PORT=""
for port in 5173 5174 5175 5176 5177; do
    if lsof -i :$port >/dev/null 2>&1; then
        DEV_PORT=$port
        break
    fi
done

if [ -z "$DEV_PORT" ]; then
    echo "❌ Development server failed to start"
    exit 1
fi

echo "✅ Development server started on port $DEV_PORT (PID: $DEV_PID)"

# Display status
echo ""
echo "🎉 Development server is running!"
echo ""
echo "📊 Server Status:"
echo "   Development Server: https://localhost:$DEV_PORT ✅"
echo ""
echo "🔗 URLs for Framer:"
echo "   Primary URL:        https://framer.com/plugins/open"
echo "   Local Development:  https://localhost:$DEV_PORT"
echo ""
echo "📝 Instructions:"
echo "   1. Open Framer"
echo "   2. Go to Plugins → Developer Tools"
echo "   3. Click 'Open Development Plugin'"
echo "   4. Enter: https://localhost:$DEV_PORT"
echo "   5. Click 'Load'"
echo ""
echo "🛑 To stop server:"
echo "   Press Ctrl+C or run: ./stop-servers.sh"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development server..."
    kill $DEV_PID 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo "✅ Development server stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Monitor server health
echo "📊 Monitoring server health (Press Ctrl+C to stop)..."
echo ""

while true; do
    if ! lsof -i :$DEV_PORT >/dev/null 2>&1; then
        echo "❌ Development server stopped unexpectedly"
        cleanup
    fi
    
    sleep 10
done 
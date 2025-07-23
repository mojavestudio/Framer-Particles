#!/bin/bash

echo "🛑 Stopping Mojave Particles development server..."

# Stop vite development server
pkill -f "vite" 2>/dev/null || echo "   No development server found"

# Wait a moment for processes to stop
sleep 2

# Check if ports are free
if ! lsof -i :5173 >/dev/null 2>&1; then
    echo "✅ Port 5173 is free"
else
    echo "⚠️  Port 5173 is still in use"
fi

echo "🎉 Development server stopped!" 
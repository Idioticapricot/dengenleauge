#!/bin/bash

echo "🚀 Starting DengenLeague Development Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database is configured
if ! grep -q "DATABASE_URL=" .env || grep -q "DATABASE_URL=\"\"" .env; then
    echo "⚠️  Please configure DATABASE_URL in .env"
    echo "   Example: DATABASE_URL=\"postgresql://username:password@localhost:5432/dengenleague\""
fi

# Push database schema
echo "🗄️  Syncing database schema..."
npx prisma db push

echo "✅ Starting development server on http://localhost:3000"
echo "📋 Available pages:"
echo "   - /team - Build your meme coin team"
echo "   - /battle - Fight AI opponents"
echo "   - /game - PvP battles"
echo "   - /defi - DeFi dashboard"
echo "   - /profile - User profile and stats"
echo "   - /admin - Deploy DEGEN token (testnet)"
echo ""

npm run dev
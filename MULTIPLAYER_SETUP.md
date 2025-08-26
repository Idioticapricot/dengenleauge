# 🎮 Multiplayer Setup Guide

## Quick Start

### 1. Start the Socket Server
```bash
npm run dev:socket
```
This starts the WebSocket server on port 3001.

### 2. Start the Next.js App (in another terminal)
```bash
npm run dev
```
This starts the main app on port 3000.

### 3. Test Multiplayer
1. Open two browser windows/tabs
2. Connect wallets in both
3. Create teams in both
4. Go to "PvP" tab in navigation
5. Click "FIND MATCH" in both windows
6. Watch the real-time battle!

## Features Implemented

✅ **WebSocket Infrastructure**
- Real-time communication with Socket.io
- Battle rooms for isolated matches
- Automatic matchmaking queue

✅ **Matchmaking System**
- FIFO queue (first-come-first-served)
- Automatic player matching
- Queue status display

✅ **Real-Time Battles**
- Synchronized price updates every second
- Live score tracking for both players
- Same price data for fair competition

✅ **Battle Results**
- Winner determination based on team performance
- Database persistence of battle history
- User stats updates (wins/losses/streaks)

✅ **UI Components**
- Matchmaking interface with queue status
- Live battle room with real-time charts
- Results screen with play again option
- Stats page with AI vs PvP battle tabs

## Architecture

```
Frontend (Next.js) ←→ Socket Server (port 3001) ←→ Database (Prisma)
                   ↓
            CoinMarketCap API (real prices)
```

## Database Schema

- `MultiplayerBattle` - Stores battle results and history
- `MatchmakingQueue` - Manages player queue (optional, currently in-memory)
- Updated `User` model with multiplayer relations

## Environment Variables

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CMC_API_KEY=your_coinmarketcap_api_key
```

## Testing

1. **Single Player Test**: One browser window to test matchmaking queue
2. **Two Player Test**: Two windows to test full multiplayer flow
3. **Battle Flow**: Team selection → Matchmaking → Battle → Results → Stats

The system is now ready for real-time multiplayer crypto battles! 🚀
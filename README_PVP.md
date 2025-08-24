# PvP Battle System Implementation

## 🎯 Overview

The PvP (Player vs Player) battle system allows players to discover each other, create battles, share battle IDs, and engage in real-time turn-based combat with synchronized battle logs.

## 🏗️ Architecture

### Core Components

1. **`usePvPBattle` Hook** (`/hooks/usePvPBattle.ts`)
   - Manages battle state and player discovery
   - Handles battle creation, joining, and actions
   - Persists battle data in localStorage
   - Simulates online player discovery

2. **`PvPLobby` Component** (`/components/game/PvPLobby.tsx`)
   - Player discovery interface
   - Team selection (3 beasts)
   - Battle creation and joining via Battle ID
   - Challenge system for online players

3. **`PvPBattleArena` Component** (`/components/game/PvPBattleArena.tsx`)
   - Real-time battle interface
   - Turn-based action system
   - Synchronized battle logs
   - Health tracking and win conditions

4. **`PvP Page`** (`/app/pvp/page.tsx`)
   - Main PvP interface
   - State management between lobby and battle

## 🎮 Game Flow

### 1. Player Discovery
```typescript
// Simulated online players (updates every 5 seconds)
const mockPlayers = [
  "0x1234...5678",
  "0xabcd...efgh", 
  "0x9876...5432",
  "0xfedc...ba98"
].filter(() => Math.random() > 0.3)
```

### 2. Battle Creation
```typescript
const createBattle = (playerBeasts: Beast[]) => {
  const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  // Creates battle state with waiting status
  // Returns shareable battle ID
}
```

### 3. Battle ID Sharing
- Players can copy/share battle IDs
- Others join using the Battle ID
- Battle starts when 2 players are ready

### 4. Turn-Based Combat
```typescript
interface BattleAction {
  id: string
  playerId: string
  type: "attack" | "defend" | "special"
  beastId: string
  targetBeastId?: string
  damage?: number
  timestamp: number
}
```

## 🔄 Battle Synchronization

### State Management
- Battle state stored in localStorage
- Real-time updates via React state
- Turn timer (30 seconds per turn)
- Auto-skip on timeout

### Battle Log Sync
```typescript
// Actions are logged with timestamps
const fullAction: BattleAction = {
  ...action,
  id: actionId,
  timestamp: Date.now()
}

battleState.actions.push(fullAction)
```

### Health & Damage System
```typescript
// Damage calculation
const damage = Math.floor(Math.random() * 20) + 10

// Apply damage to target beast
targetBeast.currentHealth = Math.max(0, targetBeast.currentHealth - damage)
```

## 🎯 Key Features

### Player Discovery
- **Online Status**: Simulated online player list
- **Challenge System**: Direct player challenges
- **Battle ID Sharing**: Copy/paste battle IDs

### Battle Management
- **Team Selection**: Choose 3 beasts before battle
- **Battle States**: waiting → active → finished
- **Turn Management**: 30-second turns with auto-skip

### Real-Time Combat
- **Action Types**: Attack, Defend, Special
- **Target Selection**: Choose enemy beasts to attack
- **Health Tracking**: Visual health bars
- **Win Conditions**: Last player with alive beasts wins

### Battle Logs
- **Action History**: All moves logged with timestamps
- **Damage Display**: Shows damage dealt
- **Player Actions**: Clear action descriptions
- **Real-Time Updates**: Synchronized across players

## 🛠️ Technical Implementation

### Data Structures
```typescript
interface Beast {
  id: string
  name: string
  type: "fire" | "water" | "earth" | "electric"
  stats: { health: number; stamina: number; power: number }
  currentHealth: number
}

interface BattleState {
  id: string
  status: "waiting" | "active" | "finished"
  players: { [playerId: string]: Player }
  currentTurn: string
  turnTimeLeft: number
  actions: BattleAction[]
  winner?: string
}
```

### Storage & Persistence
- **localStorage**: Battle state persistence
- **React State**: Real-time UI updates
- **Auto-cleanup**: Remove old battles

### Mock Data
- **Beast Library**: 4 different beast types
- **Online Players**: Simulated player discovery
- **Battle Actions**: Mock damage calculations

## 🚀 Usage

### Starting a Battle
1. Navigate to `/pvp`
2. Select 3 beasts for your team
3. Either:
   - Create a new battle (get Battle ID)
   - Join existing battle (enter Battle ID)
   - Challenge an online player

### During Battle
1. Wait for your turn (30-second timer)
2. Choose action: Attack, Defend, or Special
3. Select your beast to perform action
4. If attacking, select target enemy beast
5. Execute action and wait for opponent

### Battle End
- Battle ends when one player has no alive beasts
- Winner announcement displayed
- Return to lobby to start new battles

## 🔧 Integration Points

### Wallet Integration
- Player identification via wallet address
- Mock balance checks for battle entry fees
- Network switching support

### Navigation
- Added PvP tab to bottom navigation
- Seamless transition between lobby and battle
- Back button support

### Styling
- Consistent Neo Brutalism theme
- Color-coded battle states
- Responsive design for mobile/desktop

## 🎯 Future Enhancements

### Real Backend Integration
- WebSocket connections for real-time sync
- Database storage for battle history
- Matchmaking algorithms

### Smart Contract Integration
- On-chain battle verification
- Token rewards for winners
- NFT beast ownership verification

### Advanced Features
- Spectator mode
- Tournament brackets
- Replay system
- Advanced battle statistics

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive grid layouts
- Optimized for portrait mode
- Fast action selection

The PvP system provides a complete turn-based battle experience with player discovery, battle ID sharing, and synchronized combat logs, ready for integration with backend services and smart contracts.
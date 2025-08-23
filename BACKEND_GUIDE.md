# 🎮 Battle Beasts - Backend & Database Implementation Guide

## 📊 **SUPABASE DATABASE SCHEMA**

### **1. Users Table**
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Stats
  total_battles INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_earnings DECIMAL(18,8) DEFAULT 0,
  
  -- Preferences
  is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
```

### **2. Beasts Table**
```sql
CREATE TABLE beasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'advanced', 'legendary')),
  element_type TEXT NOT NULL CHECK (element_type IN ('fire', 'water', 'earth', 'electric')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  
  -- Level & Experience
  level INTEGER DEFAULT 5,
  current_exp INTEGER DEFAULT 0,
  required_exp INTEGER DEFAULT 100,
  
  -- Stats
  health INTEGER NOT NULL,
  stamina INTEGER NOT NULL,
  power INTEGER NOT NULL,
  
  -- Metadata
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status
  is_for_sale BOOLEAN DEFAULT false,
  sale_price DECIMAL(18,8),
  is_in_battle BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_beasts_owner_id ON beasts(owner_id);
CREATE INDEX idx_beasts_tier ON beasts(tier);
CREATE INDEX idx_beasts_element_type ON beasts(element_type);
CREATE INDEX idx_beasts_for_sale ON beasts(is_for_sale) WHERE is_for_sale = true;
```

### **3. Moves Table**
```sql
CREATE TABLE moves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  element_type TEXT NOT NULL CHECK (element_type IN ('fire', 'water', 'earth', 'electric')),
  damage INTEGER NOT NULL,
  cooldown INTEGER NOT NULL,
  description TEXT,
  min_level INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default moves
INSERT INTO moves (name, element_type, damage, cooldown, description, min_level) VALUES
-- Fire Moves
('Flame Burst', 'fire', 45, 2, 'A basic fire attack that burns enemies', 1),
('Inferno Strike', 'fire', 65, 3, 'A powerful fire attack with high damage', 10),
('Meteor Crash', 'fire', 85, 4, 'Ultimate fire move with devastating power', 15),

-- Water Moves  
('Water Pulse', 'water', 40, 2, 'A basic water attack that soaks enemies', 1),
('Tidal Wave', 'water', 60, 3, 'A powerful water attack that crashes down', 10),
('Tsunami Force', 'water', 80, 4, 'Ultimate water move with crushing force', 15),

-- Earth Moves
('Rock Throw', 'earth', 50, 2, 'A basic earth attack using solid rocks', 1),
('Earthquake', 'earth', 70, 3, 'A powerful earth attack that shakes the ground', 10),
('Mountain Crush', 'earth', 90, 4, 'Ultimate earth move with immense weight', 15),

-- Electric Moves
('Thunder Bolt', 'electric', 55, 2, 'A basic electric attack with shocking power', 1),
('Lightning Strike', 'electric', 75, 3, 'A powerful electric attack from the sky', 10),
('Storm Fury', 'electric', 95, 4, 'Ultimate electric move with storm power', 15);
```

### **4. Beast Moves Junction Table**
```sql
CREATE TABLE beast_moves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  beast_id UUID REFERENCES beasts(id) ON DELETE CASCADE,
  move_id UUID REFERENCES moves(id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL CHECK (slot_index BETWEEN 0 AND 3),
  learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(beast_id, slot_index),
  UNIQUE(beast_id, move_id)
);

CREATE INDEX idx_beast_moves_beast_id ON beast_moves(beast_id);
```

### **5. Teams Table**
```sql
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  beast1_id UUID REFERENCES beasts(id),
  beast2_id UUID REFERENCES beasts(id),
  beast3_id UUID REFERENCES beasts(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id) -- Only one active team per user
);

CREATE INDEX idx_teams_user_id ON teams(user_id);
```

### **6. Battles Table**
```sql
CREATE TABLE battles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_type TEXT NOT NULL CHECK (battle_type IN ('pvp', 'pve')),
  
  -- Players
  player1_id UUID REFERENCES users(id),
  player2_id UUID REFERENCES users(id), -- NULL for PvE
  
  -- Teams
  player1_team UUID REFERENCES teams(id),
  player2_team UUID REFERENCES teams(id), -- NULL for PvE, use wild beasts
  
  -- Battle State
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_turn INTEGER DEFAULT 1,
  winner_id UUID REFERENCES users(id),
  
  -- Stakes & Rewards
  stake_amount DECIMAL(18,8) DEFAULT 0,
  winner_reward DECIMAL(18,8) DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Battle Data (JSON)
  battle_log JSONB DEFAULT '[]'::jsonb,
  final_state JSONB
);

CREATE INDEX idx_battles_player1_id ON battles(player1_id);
CREATE INDEX idx_battles_player2_id ON battles(player2_id);
CREATE INDEX idx_battles_status ON battles(status);
CREATE INDEX idx_battles_started_at ON battles(started_at);
```

### **7. Marketplace Listings Table**
```sql
CREATE TABLE marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  beast_id UUID REFERENCES beasts(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(18,8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,
  buyer_id UUID REFERENCES users(id)
);

CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_seller_id ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_created_at ON marketplace_listings(created_at);
```

### **8. Battle Actions Table**
```sql
CREATE TABLE battle_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  player_id UUID REFERENCES users(id),
  beast_id UUID REFERENCES beasts(id),
  move_id UUID REFERENCES moves(id),
  target_beast_id UUID REFERENCES beasts(id),
  damage_dealt INTEGER DEFAULT 0,
  action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Action metadata
  action_data JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_battle_actions_battle_id ON battle_actions(battle_id);
CREATE INDEX idx_battle_actions_turn_number ON battle_actions(battle_id, turn_number);
```

---

## 🔧 **BACKEND API ENDPOINTS NEEDED**

### **Authentication & Users**
```typescript
// Replace hardcoded wallet data
GET /api/users/profile/:walletAddress
POST /api/users/create
PUT /api/users/:id/update

// Current usage in: Header.tsx, Profile.tsx
```

### **Beast Management**
```typescript
// Replace mockBeasts data
GET /api/beasts/user/:userId          // Team.tsx, Profile.tsx
GET /api/beasts/:id                   // BeastCard.tsx
POST /api/beasts/create               // Create.tsx
PUT /api/beasts/:id/level-up          // LevelUpModal.tsx
PUT /api/beasts/:id/learn-move        // LearnMoveModal.tsx

// Current usage: All beast-related components
```

### **Battle System**
```typescript
// Replace battle simulation
POST /api/battles/start               // Battle.tsx
GET /api/battles/:id/state            // BattleArena.tsx
POST /api/battles/:id/move            // MoveSelector.tsx
PUT /api/battles/:id/end              // Battle.tsx

// Current usage: Battle components
```

### **Team Management**
```typescript
// Replace team state management
GET /api/teams/user/:userId           // Team.tsx
POST /api/teams/save                  // Team.tsx
PUT /api/teams/:id/update             // Team.tsx

// Current usage: Team.tsx
```

### **Marketplace**
```typescript
// Replace marketplace mock data
GET /api/marketplace/listings         // Marketplace.tsx
POST /api/marketplace/list            // SellModal.tsx
POST /api/marketplace/buy/:listingId  // Marketplace.tsx
DELETE /api/marketplace/:listingId    // SellModal.tsx

// Current usage: Marketplace.tsx, SellModal.tsx
```

### **Leaderboard**
```typescript
// Replace leaderboard mock data
GET /api/leaderboard/top              // Leaderboard.tsx

// Current usage: Leaderboard.tsx
```

### **Wallet & Tokens**
```typescript
// Replace wallet mock functions
POST /api/wallet/buy-wam              // Profile.tsx
POST /api/wallet/withdraw             // Profile.tsx
GET /api/wallet/balance/:address      // WalletProvider.tsx

// Current usage: Profile.tsx, WalletProvider.tsx
```

---

## 📝 **SPECIFIC CODE LOCATIONS TO REPLACE**

### **1. Team Page (`app/team/page.tsx`)**
```typescript
// REPLACE THESE LINES:
import { mockBeasts } from "../../data/mockBeasts"

// WITH API CALLS:
const { data: userBeasts } = await fetch(`/api/beasts/user/${userId}`)

// REPLACE THESE FUNCTIONS:
handleConfirmLevelUp() // Line 185 - Call API instead of console.log
handleLearnMove()      // Line 195 - Call API instead of console.log
handleSaveTeam()       // Add this function to save team to DB
```

### **2. Battle Page (`app/battle/page.tsx`)**
```typescript
// REPLACE THESE LINES:
const player1Team = mockBeasts.slice(0, 3) // Line 208
const player2Team = mockBeasts.slice(3, 6) // Line 209

// WITH API CALLS:
const { data: userTeam } = await fetch(`/api/teams/user/${userId}`)
const { data: opponentTeam } = await fetch(`/api/battles/find-opponent`)

// REPLACE THESE FUNCTIONS:
startBattle()      // Line 215 - Call API to create battle
handleMoveSelect() // Line 230 - Call API to process move
```

### **3. Marketplace Page (`app/marketplace/page.tsx`)**
```typescript
// REPLACE THESE LINES:
import { mockBeasts } from "../../data/mockBeasts"

// WITH API CALLS:
const { data: listings } = await fetch('/api/marketplace/listings')

// ADD THESE FUNCTIONS:
handleBuyBeast()   // Call API to purchase beast
handleSellBeast()  // Already in SellModal, connect to API
```

### **4. Create Page (`app/create/page.tsx`)**
```typescript
// REPLACE THIS FUNCTION:
handleCreate() // Line 445 - Call API to mint beast instead of router.push
```

### **5. Profile Page (`app/profile/page.tsx`)**
```typescript
// REPLACE THESE FUNCTIONS:
handleDeposit()        // Line 280 - Call smart contract
handleConfirmWithdraw() // Line 295 - Call smart contract
// ADD: Load user's beasts, battle history, live battles
```

### **6. Leaderboard Page (`app/leaderboard/page.tsx`)**
```typescript
// REPLACE THIS DATA:
const leaderboardData = [...] // Line 150

// WITH API CALL:
const { data: leaderboard } = await fetch('/api/leaderboard/top')
```

### **7. Wallet Provider (`components/wallet/WalletProvider.tsx`)**
```typescript
// ADD REAL WALLET INTEGRATION:
// - Connect to MetaMask/Core Wallet
// - Get real balance from blockchain
// - Handle transaction signing
```

---

## 🚀 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core Data (Week 1)**
1. **Setup Supabase** - Create database and tables
2. **User Management** - Wallet authentication
3. **Beast System** - CRUD operations for beasts
4. **Team Management** - Save/load user teams

### **Phase 2: Battle System (Week 2)**
1. **Battle Creation** - PvP matchmaking, PvE setup
2. **Turn Management** - Move processing, damage calculation
3. **Battle State** - Real-time battle updates
4. **Rewards** - EXP distribution, token rewards

### **Phase 3: Economy (Week 3)**
1. **Marketplace** - Buy/sell beasts
2. **Token Integration** - $WAM token transactions
3. **Wallet Functions** - Deposit/withdraw
4. **Pricing Logic** - Dynamic beast pricing

### **Phase 4: Polish (Week 4)**
1. **Leaderboard** - Real player rankings
2. **Battle History** - Past battle records
3. **Statistics** - Player performance tracking
4. **Optimization** - Query performance, caching

---

## 🔗 **SUPABASE SETUP COMMANDS**

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize project
supabase init

# Start local development
supabase start

# Create migration files
supabase migration new create_users_table
supabase migration new create_beasts_table
# ... etc for each table

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts
```

---

## 📊 **EXAMPLE API IMPLEMENTATION**

### **Beast API Example**
```typescript
// /api/beasts/user/[userId].ts
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { data: beasts, error } = await supabase
    .from('beasts')
    .select(`
      *,
      beast_moves (
        slot_index,
        moves (*)
      )
    `)
    .eq('owner_id', params.userId)
    .eq('is_for_sale', false)

  if (error) throw error
  return Response.json(beasts)
}
```

### **Battle API Example**
```typescript
// /api/battles/start.ts
export async function POST(request: Request) {
  const { mode, teamId, stakeAmount } = await request.json()
  
  const { data: battle, error } = await supabase
    .from('battles')
    .insert({
      battle_type: mode,
      player1_id: userId,
      player1_team: teamId,
      stake_amount: stakeAmount,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return Response.json(battle)
}
```

---

## 🎯 **SUCCESS METRICS**

- [ ] All mock data replaced with real database calls
- [ ] User authentication with wallet connection
- [ ] Beast creation, leveling, and move learning
- [ ] Real-time battle system with turn management
- [ ] Marketplace with actual $WAM transactions
- [ ] Leaderboard with real player statistics
- [ ] Profile with battle history and owned beasts

**The frontend is 100% ready - just replace the mock data with real API calls!**
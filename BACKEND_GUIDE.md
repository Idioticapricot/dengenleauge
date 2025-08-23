# 🎮 Battle Beasts - Backend & Database Implementation Guide

## 🔗 **EXTERNAL INTEGRATIONS**

### **1. fal.ai Image Generation**
```typescript
// Beast creation with AI-generated images
POST https://fal.run/fal-ai/flux/schnell
Headers: {
  "Authorization": "Key YOUR_FAL_AI_KEY",
  "Content-Type": "application/json"
}
Body: {
  "prompt": "description from user input",
  "image_size": "square_hd",
  "num_inference_steps": 4,
  "enable_safety_checker": true
}
```

### **2. Blockchain NFT Integration (On-Chain Image Storage)**
```typescript
// NFT Minting with on-chain metadata (RECOMMENDED APPROACH)
// Ethereum/Polygon/Base - use wagmi + viem
// Solana - use @solana/web3.js

const mintBeast = async (metadata: BeastMetadata) => {
  // 1. Upload fal.ai image to IPFS for permanent storage
  const imageIPFS = await uploadToIPFS(metadata.imageUrl)
  
  // 2. Create complete NFT metadata with IPFS image
  const nftMetadata = {
    name: metadata.name,
    description: metadata.description,
    image: imageIPFS, // IPFS hash of fal.ai generated image
    external_url: `https://battlebeasts.game/beast/${metadata.id}`,
    attributes: [
      { trait_type: "Tier", value: metadata.tier },
      { trait_type: "Element", value: metadata.element_type },
      { trait_type: "Level", value: metadata.level },
      { trait_type: "Rarity", value: metadata.rarity }
    ]
  }
  
  // 3. Upload metadata to IPFS
  const metadataURI = await uploadToIPFS(nftMetadata)
  
  // 4. Mint NFT with metadata URI
  const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)
  const tx = await contract.mint(userAddress, metadataURI)
  
  return { 
    hash: tx.hash, 
    tokenURI: metadataURI,
    imageIPFS: imageIPFS
  }
}

// Benefits: True decentralization, censorship resistance, permanent storage
// Trade-off: Higher gas costs but authentic Web3 ownership
```

### **3. WebSocket Battle System**
```typescript
// Real-time battle updates
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
})

io.on('connection', (socket) => {
  socket.on('join-battle', (battleId) => {
    socket.join(`battle-${battleId}`)
  })
  
  socket.on('make-move', async (data) => {
    // Process move, update battle state
    io.to(`battle-${data.battleId}`).emit('battle-update', newState)
  })
  
  socket.on('disconnect', async () => {
    // Handle player disconnection
    const activeBattles = await findActiveBattlesBySocket(socket.id)
    
    for (const battle of activeBattles) {
      await supabase
        .from('battles')
        .update({ 
          status: 'abandoned',
          ended_at: new Date().toISOString(),
          winner_id: battle.opponent_id
        })
        .eq('id', battle.id)
      
      // Notify opponent of disconnect win
      io.to(`battle-${battle.id}`).emit('opponent-disconnected', {
        winner: battle.opponent_id,
        reason: 'disconnect'
      })
    }
  })
})
```

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
  
  -- NFT Integration
  nft_token_id TEXT UNIQUE, -- Blockchain token ID
  nft_contract_address TEXT, -- Contract address
  blockchain TEXT DEFAULT 'ethereum', -- ethereum/polygon/solana
  
  -- Level & Experience (Updated)
  level INTEGER DEFAULT 5, -- Start at level 5
  current_exp INTEGER DEFAULT 0,
  required_exp INTEGER DEFAULT 100, -- Flat 100 EXP per level
  
  -- Stats
  health INTEGER NOT NULL,
  stamina INTEGER NOT NULL,
  power INTEGER NOT NULL,
  
  -- Abilities (Randomized)
  abilities JSONB DEFAULT '[]'::jsonb, -- Array of ability IDs
  
  -- Metadata (Image stored on-chain in NFT)
  description TEXT, -- User input for AI generation
  ai_prompt TEXT, -- Original prompt sent to fal.ai
  nft_metadata_uri TEXT, -- IPFS URI containing image and metadata
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
  min_level INTEGER DEFAULT 5, -- Moves start at level 5
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'advanced', 'legendary')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default moves (Extensive hardcoded list)
INSERT INTO moves (name, element_type, damage, cooldown, description, min_level, tier) VALUES
-- Fire Moves
('Flame Burst', 'fire', 45, 2, 'A basic fire attack that burns enemies', 5, 'basic'),
('Inferno Strike', 'fire', 65, 3, 'A powerful fire attack with high damage', 10, 'advanced'),
('Meteor Crash', 'fire', 85, 4, 'Ultimate fire move with devastating power', 15, 'legendary'),
('Fire Whip', 'fire', 50, 2, 'Lashing flames that strike multiple times', 5, 'basic'),
('Phoenix Wing', 'fire', 70, 3, 'Blazing wings that soar through enemies', 10, 'advanced'),
('Solar Flare', 'fire', 90, 4, 'Blinding solar energy explosion', 15, 'legendary'),

-- Water Moves  
('Water Pulse', 'water', 40, 2, 'A basic water attack that soaks enemies', 5, 'basic'),
('Tidal Wave', 'water', 60, 3, 'A powerful water attack that crashes down', 10, 'advanced'),
('Tsunami Force', 'water', 80, 4, 'Ultimate water move with crushing force', 15, 'legendary'),
('Ice Shard', 'water', 45, 2, 'Sharp ice projectiles pierce enemies', 5, 'basic'),
('Whirlpool', 'water', 65, 3, 'Spinning water vortex traps foes', 10, 'advanced'),
('Absolute Zero', 'water', 85, 4, 'Freezing attack that stops time', 15, 'legendary'),

-- Earth Moves
('Rock Throw', 'earth', 50, 2, 'A basic earth attack using solid rocks', 5, 'basic'),
('Earthquake', 'earth', 70, 3, 'A powerful earth attack that shakes the ground', 10, 'advanced'),
('Mountain Crush', 'earth', 90, 4, 'Ultimate earth move with immense weight', 15, 'legendary'),
('Stone Spear', 'earth', 55, 2, 'Sharp stone projectile pierces armor', 5, 'basic'),
('Landslide', 'earth', 75, 3, 'Cascading rocks bury opponents', 10, 'advanced'),
('Continental Drift', 'earth', 95, 4, 'Tectonic force reshapes battlefield', 15, 'legendary'),

-- Electric Moves
('Thunder Bolt', 'electric', 55, 2, 'A basic electric attack with shocking power', 5, 'basic'),
('Lightning Strike', 'electric', 75, 3, 'A powerful electric attack from the sky', 10, 'advanced'),
('Storm Fury', 'electric', 95, 4, 'Ultimate electric move with storm power', 15, 'legendary'),
('Static Shock', 'electric', 40, 1, 'Quick electric jolt with low cooldown', 5, 'basic'),
('Chain Lightning', 'electric', 60, 3, 'Electric attack that jumps between foes', 10, 'advanced'),
('Divine Thunder', 'electric', 100, 5, 'Godlike thunder from the heavens', 20, 'legendary');
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
  
  -- Battle State
  final_state JSONB
);

CREATE INDEX idx_battles_player1_id ON battles(player1_id);
CREATE INDEX idx_battles_player2_id ON battles(player2_id);
CREATE INDEX idx_battles_status ON battles(status);
CREATE INDEX idx_battles_started_at ON battles(started_at);
```

### **7. Marketplace Listings Table (NFT Transfers)**
```sql
CREATE TABLE marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  beast_id UUID REFERENCES beasts(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(18,8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
  
  -- NFT Transfer Data
  nft_transfer_tx TEXT, -- Blockchain transaction hash
  transfer_status TEXT DEFAULT 'pending' CHECK (transfer_status IN ('pending', 'confirmed', 'failed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,
  buyer_id UUID REFERENCES users(id)
);

CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_seller_id ON marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_created_at ON marketplace_listings(created_at);
CREATE INDEX idx_marketplace_listings_transfer_status ON marketplace_listings(transfer_status);
```

### **8. Abilities Table**
```sql
CREATE TABLE abilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  effect_type TEXT NOT NULL CHECK (effect_type IN ('passive', 'active', 'trigger')),
  effect_data JSONB NOT NULL, -- { "stat": "health", "modifier": 1.2 }
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert extensive abilities list
INSERT INTO abilities (name, description, effect_type, effect_data, rarity) VALUES
('Thick Skin', 'Reduces incoming damage by 10%', 'passive', '{"damage_reduction": 0.1}', 'common'),
('Berserker', 'Increases damage when health is below 50%', 'trigger', '{"damage_boost": 1.3, "health_threshold": 0.5}', 'rare'),
('Regeneration', 'Heals 5% health each turn', 'passive', '{"heal_percent": 0.05}', 'rare'),
('Critical Strike', '15% chance to deal double damage', 'trigger', '{"crit_chance": 0.15, "crit_multiplier": 2.0}', 'common'),
('Elemental Mastery', 'Boosts same-element move damage by 25%', 'passive', '{"element_boost": 1.25}', 'legendary'),
('Lightning Reflexes', 'Always goes first in battle', 'passive', '{"priority": 999}', 'legendary'),
('Intimidate', 'Reduces enemy attack by 20% on entry', 'trigger', '{"enemy_attack_reduction": 0.2}', 'rare'),
('Sturdy', 'Survives with 1 HP if hit by fatal blow', 'trigger', '{"survive_fatal": true}', 'legendary'),
('Poison Touch', '30% chance to poison enemy on contact', 'trigger', '{"poison_chance": 0.3, "poison_damage": 10}', 'common'),
('Flame Body', 'Burns attackers for 15 damage', 'trigger', '{"burn_damage": 15}', 'rare');
```

### **9. User Rankings Table**
```sql
CREATE TABLE user_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rank_points INTEGER DEFAULT 1000, -- ELO-style ranking
  current_rank INTEGER,
  highest_rank INTEGER DEFAULT 999999,
  rank_tier TEXT DEFAULT 'bronze' CHECK (rank_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'master')),
  
  -- Weekly/Monthly stats
  weekly_battles INTEGER DEFAULT 0,
  weekly_wins INTEGER DEFAULT 0,
  monthly_battles INTEGER DEFAULT 0,
  monthly_wins INTEGER DEFAULT 0,
  
  last_battle_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX idx_user_rankings_rank_points ON user_rankings(rank_points DESC);
CREATE INDEX idx_user_rankings_current_rank ON user_rankings(current_rank);
CREATE INDEX idx_user_rankings_tier ON user_rankings(rank_tier);
```

### **10. Battle Actions Table**
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
CREATE INDEX idx_battle_actions_move_id ON battle_actions(move_id); -- For move analytics
```

---

---

## ⚡ **BATTLE SYSTEM LOGIC**

### **EXP Distribution System**
```typescript
// After each battle win
const distributeEXP = async (battleId: string, winnerTeamId: string) => {
  const EXP_PER_BATTLE = 100
  const team = await getTeamBeasts(winnerTeamId)
  const expPerBeast = Math.floor(EXP_PER_BATTLE / team.length) // Equal distribution
  
  for (const beast of team) {
    const oldLevel = beast.level
    const newExp = beast.current_exp + expPerBeast
    const levelsGained = Math.floor(newExp / 100) // Every 100 EXP = 1 level
    const newLevel = oldLevel + levelsGained
    
    await updateBeast(beast.id, {
      current_exp: newExp % 100, // Remainder after leveling
      level: newLevel
    })
    
    // FIXED: Check for move learning (every 5 levels)
    for (let level = oldLevel + 1; level <= newLevel; level++) {
      if (level % 5 === 0) {
        await triggerMoveSelection(beast.id, level)
        break // Only trigger once per battle
      }
    }
  }
}
```

### **Move Learning System**
```typescript
// Random move assignment based on tier
const assignRandomMove = async (beastId: string, beastTier: string) => {
  const availableMoves = await supabase
    .from('moves')
    .select('*')
    .eq('tier', beastTier)
    .lte('min_level', currentLevel)
  
  const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
  return randomMove
}
```

### **Ability Assignment System**
```typescript
// Random abilities on beast creation
const assignRandomAbilities = (beastRarity: string) => {
  const abilityCount = beastRarity === 'legendary' ? 3 : beastRarity === 'rare' ? 2 : 1
  const availableAbilities = abilities.filter(a => a.rarity <= beastRarity)
  
  return shuffleArray(availableAbilities).slice(0, abilityCount)
}
```

### **Dynamic Ranking System**
```typescript
// ELO-style ranking updates
const updateRankings = async (winnerId: string, loserId: string) => {
  const K_FACTOR = 32
  const winner = await getUserRanking(winnerId)
  const loser = await getUserRanking(loserId)
  
  const expectedWin = 1 / (1 + Math.pow(10, (loser.rank_points - winner.rank_points) / 400))
  const newWinnerPoints = winner.rank_points + K_FACTOR * (1 - expectedWin)
  const newLoserPoints = loser.rank_points + K_FACTOR * (0 - (1 - expectedWin))
  
  await updateUserRanking(winnerId, { rank_points: newWinnerPoints })
  await updateUserRanking(loserId, { rank_points: newLoserPoints })
  
  // Recalculate all ranks
  await recalculateGlobalRanks()
}
```

## 🔧 **BACKEND API ENDPOINTS NEEDED**

### **Authentication & Users**
```typescript
// Replace hardcoded wallet data
GET /api/users/profile/:walletAddress
POST /api/users/create
PUT /api/users/:id/update

// Current usage in: Header.tsx, Profile.tsx
```

### **Beast Management & NFT Integration**
```typescript
// Replace mockBeasts data
GET /api/beasts/user/:userId          // Team.tsx, Profile.tsx
GET /api/beasts/:id                   // BeastCard.tsx
POST /api/beasts/create               // Create.tsx - with fal.ai + NFT minting
PUT /api/beasts/:id/level-up          // LevelUpModal.tsx
PUT /api/beasts/:id/learn-move        // LearnMoveModal.tsx
POST /api/beasts/generate-image       // fal.ai integration
POST /api/beasts/mint-nft            // Blockchain minting
GET /api/beasts/verify-ownership      // NFT ownership verification

// Current usage: All beast-related components
```

### **Battle System & WebSockets**
```typescript
// Replace battle simulation
POST /api/battles/start               // Battle.tsx - deducts WAM
GET /api/battles/:id/state            // BattleArena.tsx
POST /api/battles/:id/move            // MoveSelector.tsx
PUT /api/battles/:id/end              // Battle.tsx - distributes EXP
POST /api/battles/find-opponent       // Matchmaking
GET /api/battles/user/:userId/active  // Check active battles

// WebSocket Events
WS: join-battle, make-move, battle-update, battle-end

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

### **Marketplace & NFT Transfers**
```typescript
// Replace marketplace mock data
GET /api/marketplace/listings         // Marketplace.tsx
POST /api/marketplace/list            // SellModal.tsx - creates listing
POST /api/marketplace/buy/:listingId  // Marketplace.tsx - transfers NFT
DELETE /api/marketplace/:listingId    // SellModal.tsx
POST /api/marketplace/transfer-nft    // Blockchain NFT transfer
GET /api/marketplace/verify-transfer  // Verify transfer completion

// Current usage: Marketplace.tsx, SellModal.tsx
```

### **Dynamic Leaderboard & Rankings**
```typescript
// Replace leaderboard mock data
GET /api/leaderboard/top              // Leaderboard.tsx - dynamic rankings
GET /api/leaderboard/user/:userId     // User's current rank
POST /api/rankings/update             // Update after battle
GET /api/rankings/tiers               // Rank tier distribution

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
handleCreate() // Line 445 - Call fal.ai + NFT minting APIs

// NEW IMPLEMENTATION:
const handleCreate = async () => {
  // 1. Generate image with fal.ai
  const imageResponse = await fetch('/api/beasts/generate-image', {
    method: 'POST',
    body: JSON.stringify({ prompt: description })
  })
  const { imageUrl } = await imageResponse.json()
  
  // 2. Mint NFT on blockchain
  const nftResponse = await fetch('/api/beasts/mint-nft', {
    method: 'POST',
    body: JSON.stringify({ metadata: beastData, imageUrl })
  })
  const { tokenId, contractAddress } = await nftResponse.json()
  
  // 3. Save to database
  const beast = await fetch('/api/beasts/create', {
    method: 'POST',
    body: JSON.stringify({ ...beastData, nft_token_id: tokenId })
  })
}
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

### **Phase 2: Battle System & WebSockets (Week 2)**
1. **WebSocket Setup** - Real-time battle communication
2. **Battle Creation** - WAM deduction, PvP matchmaking, PvE setup
3. **Turn Management** - Move processing, damage calculation
4. **EXP System** - 100 EXP per battle, equal distribution, level progression
5. **Move Learning** - Every 5 levels, random tier-based assignment
6. **Dynamic Rankings** - ELO-style point system

### **Phase 3: NFT Economy & AI Integration (Week 3)**
1. **fal.ai Integration** - AI image generation from descriptions
2. **NFT Minting** - Blockchain integration for beast ownership
3. **NFT Marketplace** - Transfer ownership, not just selling
4. **Token Integration** - $WAM token transactions
5. **Wallet Functions** - Deposit/withdraw
6. **Ability System** - Random ability assignment on creation

### **Phase 4: Advanced Features (Week 4)**
1. **Dynamic Leaderboard** - Real-time ranking updates (with optimized recalculation)
2. **Battle History** - Past battle records from battle_actions table
3. **NFT Verification** - Ownership validation
4. **Advanced Abilities** - Complex ability interactions
5. **WebSocket Scaling** - Handle disconnects, reconnections, zombie battle cleanup
6. **Battle Analytics** - Move usage statistics from battle_actions table

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
supabase migration new create_moves_table
supabase migration new create_abilities_table
supabase migration new create_user_rankings_table
supabase migration new create_battle_actions_table
# Note: Removed battle_log JSONB - use battle_actions table only

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts

# Install additional dependencies
npm install socket.io socket.io-client
npm install @fal-ai/serverless-client
npm install wagmi viem @wagmi/core # For Ethereum
# OR
npm install @solana/web3.js # For Solana

# For IPFS storage (on-chain metadata)
npm install ipfs-http-client
# OR use Pinata/Infura IPFS services
npm install @pinata/sdk
```

---

## 📊 **EXAMPLE API IMPLEMENTATION**

### **Beast Creation with fal.ai + On-Chain NFT**
```typescript
// /api/beasts/create.ts
export async function POST(request: Request) {
  const { name, description, tier, element_type, userId } = await request.json()
  
  // 1. Generate image with fal.ai
  const fal = await import('@fal-ai/serverless-client')
  const result = await fal.run('fal-ai/flux/schnell', {
    input: {
      prompt: description,
      image_size: 'square_hd',
      num_inference_steps: 4
    }
  })
  
  // 2. Assign random abilities
  const abilities = await assignRandomAbilities(tier)
  
  // 3. Mint NFT with on-chain metadata (image stored on IPFS)
  const nftData = await mintBeastNFT({
    name,
    description,
    imageUrl: result.images[0].url, // This gets uploaded to IPFS
    tier,
    element_type,
    level: 5,
    abilities
  })
  
  // 4. Save to database (NO image_url - it's on-chain now)
  const { data: beast, error } = await supabase
    .from('beasts')
    .insert({
      owner_id: userId,
      name,
      description,
      ai_prompt: description,
      tier,
      element_type,
      level: 5,
      nft_token_id: nftData.tokenId,
      nft_contract_address: nftData.contractAddress,
      nft_metadata_uri: nftData.tokenURI, // IPFS metadata URI
      abilities: abilities.map(a => a.id),
      // Stats, health, stamina, power...
    })
    .select()
    .single()

  return Response.json({ 
    beast, 
    nftData,
    message: "Beast created and minted as NFT with on-chain metadata" 
  })
}

// Helper function to get beast image from NFT metadata
const getBeastImage = async (nftMetadataUri: string) => {
  const metadata = await fetch(nftMetadataUri).then(r => r.json())
  return metadata.image // IPFS image URL
}
```

### **Battle API with WAM Deduction**
```typescript
// /api/battles/start.ts
export async function POST(request: Request) {
  const { mode, teamId, stakeAmount } = await request.json()
  
  // 1. Deduct WAM from user wallet
  const walletResult = await deductWAM(userId, stakeAmount)
  if (!walletResult.success) {
    return Response.json({ error: 'Insufficient WAM' }, { status: 400 })
  }
  
  // 2. Create battle
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

  // 3. Emit WebSocket event
  io.to(`user-${userId}`).emit('battle-started', battle)
  
  return Response.json(battle)
}

// Battle completion with EXP distribution
// /api/battles/complete.ts
export async function POST(request: Request) {
  const { battleId, winnerId } = await request.json()
  
  // 1. Distribute 100 EXP to winner's team
  await distributeEXP(battleId, winnerId)
  
  // 2. Update rankings
  await updateRankings(winnerId, loserId)
  
  // 3. Check for move learning opportunities
  await checkMovelearning(winnerTeam)
  
  return Response.json({ success: true })
}
```

---

## 🎯 **SUCCESS METRICS**

- [ ] All mock data replaced with real database calls
- [ ] User authentication with wallet connection
- [ ] fal.ai integration for AI-generated beast images
- [ ] NFT minting with metadata (image URL on-chain recommended)
- [ ] Beast creation starting at level 5 with random abilities
- [ ] EXP system: 100 EXP per battle, 100 EXP per level
- [ ] FIXED move learning logic: properly detects level 5, 10, 15, etc.
- [ ] WebSocket real-time battle system with disconnect handling
- [ ] WAM deduction on battle entry
- [ ] NFT marketplace with ownership transfers
- [ ] Dynamic ELO-style ranking system (optimized recalculation)
- [ ] Single source of truth: battle_actions table (no redundant battle_log)
- [ ] Extensive hardcoded moves and abilities database

## 🚨 **CRITICAL FIXES APPLIED**

1. **Move Learning Bug Fixed**: Now correctly detects when beasts pass levels 5, 10, 15, etc.
2. **Removed Redundant Storage**: Eliminated battle_log JSONB, using battle_actions table only
3. **WebSocket Disconnect Handling**: Properly handles player disconnections and zombie battles
4. **On-Chain NFT Metadata**: Image URLs stored on-chain via IPFS for true decentralization

**The frontend is 100% ready - just replace the mock data with real API calls!**
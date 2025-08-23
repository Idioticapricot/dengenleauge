# 🗄️ Battle Beasts - Database Architecture & System Diagrams

## 📊 **DATABASE ENTITY RELATIONSHIP DIAGRAM**

```mermaid
erDiagram
    USERS {
        uuid id PK
        text wallet_address UK "Unique wallet address"
        text username
        text avatar_url
        timestamp created_at
        timestamp updated_at
        integer total_battles
        integer wins
        integer losses
        decimal total_earnings
        boolean is_active
    }

    BEASTS {
        uuid id PK
        uuid owner_id FK "References users.id"
        text name
        text tier "basic|advanced|legendary"
        text element_type "fire|water|earth|electric"
        text rarity "common|rare|legendary"
        text nft_token_id UK "Blockchain token ID"
        text nft_contract_address
        text blockchain "ethereum|polygon|solana"
        integer level "Default 5"
        integer current_exp "Default 0"
        integer required_exp "Default 100"
        integer health
        integer stamina
        integer power
        jsonb abilities "Array of ability IDs"
        text description "User input for AI"
        text ai_prompt "Original fal.ai prompt"
        text nft_metadata_uri "IPFS metadata URI"
        timestamp created_at
        timestamp updated_at
        boolean is_for_sale
        decimal sale_price
        boolean is_in_battle
    }

    MOVES {
        uuid id PK
        text name
        text element_type "fire|water|earth|electric"
        integer damage
        integer cooldown
        text description
        integer min_level "Default 5"
        text tier "basic|advanced|legendary"
        timestamp created_at
    }

    ABILITIES {
        uuid id PK
        text name
        text description
        text effect_type "passive|active|trigger"
        jsonb effect_data "Effect parameters"
        text rarity "common|rare|legendary"
        timestamp created_at
    }

    BEAST_MOVES {
        uuid id PK
        uuid beast_id FK "References beasts.id"
        uuid move_id FK "References moves.id"
        integer slot_index "0-3"
        timestamp learned_at
    }

    TEAMS {
        uuid id PK
        uuid user_id FK "References users.id"
        uuid beast1_id FK "References beasts.id"
        uuid beast2_id FK "References beasts.id"
        uuid beast3_id FK "References beasts.id"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    BATTLES {
        uuid id PK
        text battle_type "pvp|pve"
        uuid player1_id FK "References users.id"
        uuid player2_id FK "References users.id (NULL for PvE)"
        uuid player1_team FK "References teams.id"
        uuid player2_team FK "References teams.id (NULL for PvE)"
        text status "active|completed|abandoned"
        integer current_turn
        uuid winner_id FK "References users.id"
        decimal stake_amount
        decimal winner_reward
        timestamp started_at
        timestamp ended_at
        jsonb final_state
    }

    BATTLE_ACTIONS {
        uuid id PK
        uuid battle_id FK "References battles.id"
        integer turn_number
        uuid player_id FK "References users.id"
        uuid beast_id FK "References beasts.id"
        uuid move_id FK "References moves.id"
        uuid target_beast_id FK "References beasts.id"
        integer damage_dealt
        timestamp action_timestamp
        jsonb action_data
    }

    MARKETPLACE_LISTINGS {
        uuid id PK
        uuid beast_id FK "References beasts.id"
        uuid seller_id FK "References users.id"
        decimal price
        text status "active|sold|cancelled"
        text nft_transfer_tx "Blockchain tx hash"
        text transfer_status "pending|confirmed|failed"
        timestamp created_at
        timestamp sold_at
        uuid buyer_id FK "References users.id"
    }

    USER_RANKINGS {
        uuid id PK
        uuid user_id FK "References users.id"
        integer rank_points "ELO-style points"
        integer current_rank
        integer highest_rank
        text rank_tier "bronze|silver|gold|platinum|diamond|master"
        integer weekly_battles
        integer weekly_wins
        integer monthly_battles
        integer monthly_wins
        timestamp last_battle_at
        timestamp updated_at
    }

    %% Relationships
    USERS ||--o{ BEASTS : owns
    USERS ||--o{ TEAMS : creates
    USERS ||--o{ BATTLES : participates
    USERS ||--o{ BATTLE_ACTIONS : performs
    USERS ||--o{ MARKETPLACE_LISTINGS : sells
    USERS ||--o{ USER_RANKINGS : has

    BEASTS ||--o{ BEAST_MOVES : learns
    BEASTS ||--o{ TEAMS : "belongs to"
    BEASTS ||--o{ BATTLE_ACTIONS : "uses in battle"
    BEASTS ||--o{ MARKETPLACE_LISTINGS : "listed for sale"

    MOVES ||--o{ BEAST_MOVES : "learned by beasts"
    MOVES ||--o{ BATTLE_ACTIONS : "used in battle"

    TEAMS ||--o{ BATTLES : "fights in"

    BATTLES ||--o{ BATTLE_ACTIONS : contains
```

## 🔄 **SYSTEM FLOW DIAGRAM**

```mermaid
flowchart TD
    A[User Connects Wallet] --> B[Create Account in DB]
    B --> C[Beast Creation Flow]
    
    C --> D[User Inputs Description]
    D --> E[fal.ai Generates Image]
    E --> F[Upload Image to IPFS]
    F --> G[Create NFT Metadata]
    G --> H[Upload Metadata to IPFS]
    H --> I[Mint NFT on Blockchain]
    I --> J[Save Beast to Database]
    J --> K[Assign Random Abilities]
    
    K --> L[Team Management]
    L --> M[Select 3 Beasts for Team]
    M --> N[Battle System]
    
    N --> O{Battle Type?}
    O -->|PvP| P[Find Opponent]
    O -->|PvE| Q[Generate AI Opponent]
    
    P --> R[Deduct WAM Stake]
    Q --> R
    R --> S[Create Battle Record]
    S --> T[WebSocket Battle Room]
    
    T --> U[Turn-Based Combat]
    U --> V[Record Battle Actions]
    V --> W{Battle Complete?}
    W -->|No| U
    W -->|Yes| X[Determine Winner]
    
    X --> Y[Distribute 100 EXP]
    Y --> Z[Update Rankings ELO]
    Z --> AA{Level Up?}
    AA -->|Yes| BB[Check Move Learning]
    AA -->|No| CC[Battle Complete]
    BB --> DD{Level % 5 == 0?}
    DD -->|Yes| EE[Trigger Move Selection]
    DD -->|No| CC
    EE --> CC
    
    CC --> FF[Marketplace]
    FF --> GG[List Beast for Sale]
    GG --> HH[Transfer NFT Ownership]
    HH --> II[Update Database Owner]
```

## 🏗️ **BATTLE SYSTEM ARCHITECTURE**

```mermaid
sequenceDiagram
    participant U1 as Player 1
    participant U2 as Player 2
    participant WS as WebSocket Server
    participant DB as Database
    participant BC as Blockchain

    U1->>WS: Join Battle Queue
    U2->>WS: Join Battle Queue
    WS->>DB: Create Battle Record
    WS->>U1: Battle Found
    WS->>U2: Battle Found
    
    U1->>WS: Join Battle Room
    U2->>WS: Join Battle Room
    
    loop Turn-Based Combat
        U1->>WS: Select Move
        WS->>DB: Record Battle Action
        WS->>U2: Battle Update (Move Result)
        U2->>WS: Select Move
        WS->>DB: Record Battle Action
        WS->>U1: Battle Update (Move Result)
    end
    
    WS->>DB: Battle Complete
    WS->>DB: Distribute EXP
    WS->>DB: Update Rankings
    WS->>U1: Battle Result
    WS->>U2: Battle Result
    
    alt Player Disconnects
        U1->>WS: Disconnect
        WS->>DB: Mark Battle Abandoned
        WS->>U2: Opponent Disconnected (You Win)
    end
```

## 🎨 **NFT CREATION FLOW**

```mermaid
flowchart LR
    A[User Description] --> B[fal.ai API]
    B --> C[Generated Image URL]
    C --> D[Upload to IPFS]
    D --> E[IPFS Image Hash]
    
    E --> F[Create NFT Metadata]
    F --> G[NFT Metadata JSON]
    G --> H[Upload Metadata to IPFS]
    H --> I[IPFS Metadata URI]
    
    I --> J[Smart Contract]
    J --> K[Mint NFT]
    K --> L[Token ID + Contract Address]
    
    L --> M[Database Record]
    M --> N[Beast Created]
    
    subgraph "NFT Metadata Structure"
        O[name: Beast Name]
        P[description: User Input]
        Q[image: IPFS Image Hash]
        R[attributes: Tier, Element, Level]
        S[external_url: Game URL]
    end
    
    G --> O
    G --> P
    G --> Q
    G --> R
    G --> S
```

## 📈 **EXP & LEVELING SYSTEM**

```mermaid
flowchart TD
    A[Battle Won] --> B[100 EXP Total]
    B --> C[Divide by Team Size]
    C --> D[EXP Per Beast]
    
    D --> E{Current EXP + New EXP}
    E --> F[Calculate Levels Gained]
    F --> G[Update Beast Level]
    
    G --> H[Loop Through Gained Levels]
    H --> I{Level % 5 == 0?}
    I -->|Yes| J[Trigger Move Learning]
    I -->|No| K[Continue Loop]
    J --> L[Random Move Selection by Tier]
    L --> M[Update Beast Moves]
    K --> N{More Levels?}
    N -->|Yes| H
    N -->|No| O[Leveling Complete]
    M --> O
```

## 🏪 **MARKETPLACE & NFT TRANSFER**

```mermaid
stateDiagram-v2
    [*] --> Listed: Beast Listed for Sale
    Listed --> Pending: Buyer Purchases
    Pending --> Transferring: Initiate NFT Transfer
    Transferring --> Confirmed: Blockchain Confirms
    Transferring --> Failed: Transfer Fails
    Confirmed --> Sold: Update Database Owner
    Failed --> Listed: Return to Market
    Listed --> Cancelled: Owner Cancels
    Sold --> [*]
    Cancelled --> [*]
    
    note right of Transferring
        NFT ownership transferred
        on blockchain via smart contract
    end note
    
    note right of Confirmed
        Database updated with new owner
        Original owner loses access
    end note
```

## 🔗 **KEY RELATIONSHIPS EXPLAINED**

### **1. User → Beast Ownership**
- **One-to-Many**: Each user can own multiple beasts
- **NFT Integration**: Ownership verified on blockchain
- **Database Sync**: `beasts.owner_id` references `users.id`

### **2. Beast → Moves Learning**
- **Many-to-Many**: Each beast can learn multiple moves, each move can be learned by multiple beasts
- **Junction Table**: `beast_moves` with `slot_index` (0-3)
- **Level Restriction**: Moves have `min_level` requirements

### **3. Team Composition**
- **Fixed Structure**: Exactly 3 beasts per team
- **User Ownership**: All team beasts must belong to the same user
- **Battle Ready**: Teams used in battle system

### **4. Battle System**
- **Player Participation**: 1-2 players (PvE has NULL player2)
- **Team Assignment**: Each player brings their active team
- **Action Logging**: All moves recorded in `battle_actions`

### **5. Marketplace Transfers**
- **NFT-Based**: Actual blockchain ownership transfer
- **Status Tracking**: Pending → Confirmed → Complete
- **Database Update**: Owner changes after blockchain confirmation

### **6. Ranking System**
- **ELO Algorithm**: Points gained/lost based on opponent strength
- **Dynamic Ranks**: Recalculated after each battle
- **Tier System**: Bronze → Silver → Gold → Platinum → Diamond → Master

## 🚀 **IMPLEMENTATION CHECKLIST**

- [ ] **Phase 1**: Core tables (users, beasts, moves, abilities)
- [ ] **Phase 2**: Battle system (battles, battle_actions, teams)
- [ ] **Phase 3**: Economy (marketplace_listings, user_rankings)
- [ ] **Phase 4**: Indexes and optimization
- [ ] **Phase 5**: WebSocket integration
- [ ] **Phase 6**: NFT smart contracts
- [ ] **Phase 7**: fal.ai + IPFS integration

**Total Tables**: 10 tables with 15+ foreign key relationships
**External Integrations**: fal.ai, IPFS, Blockchain, WebSockets
**Real-time Features**: Battle updates, ranking changes, marketplace activity
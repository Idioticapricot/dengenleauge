# Algorand Developer Guide for DengenLeague

## 🔗 Wallet Connection

### Current Implementation
```typescript
// lib/algorand-config.ts
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

export const peraWallet = new PeraWalletConnect();
export const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
```

### How Wallet Connection Works
1. **Pera Wallet** - Mobile wallet that connects via QR code or deep linking
2. **Connection Flow**:
   ```typescript
   const accounts = await peraWallet.connect();
   // Returns array of connected addresses
   ```
3. **Account Info**:
   ```typescript
   const accountInfo = await algodClient.accountInformation(address).do();
   const balance = accountInfo.amount / 1000000; // microAlgos to ALGOs
   ```

### Supported Wallets
- **Pera Wallet** (Primary) - Mobile + Browser extension
- **Defly Wallet** - Add: `npm install @blockshake/defly-connect`
- **MyAlgo Wallet** - Add: `npm install @randlabs/myalgo-connect`

## 📝 Smart Contracts

### 1. Algorand Standard Assets (ASAs)
Replace ERC20 tokens with native Algorand assets:

```typescript
// Create WAM Token ASA
const createAssetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
  from: creatorAddress,
  total: 1000000000, // 1 billion tokens
  decimals: 6,
  assetName: "WAM Token",
  unitName: "WAM",
  assetURL: "https://wam.token",
  suggestedParams: params,
});
```

### 2. Smart Contracts (PyTeal/Teal)

#### AMM Contract Structure
```python
# amm_contract.py (PyTeal)
from pyteal import *

def amm_contract():
    # State variables
    pool_token_a = Bytes("pool_a")
    pool_token_b = Bytes("pool_b") 
    total_shares = Bytes("shares")
    
    # Add liquidity
    add_liquidity = Seq([
        # Verify assets
        # Calculate shares
        # Update pools
        Approve()
    ])
    
    # Swap tokens
    swap = Seq([
        # Calculate output with slippage
        # Transfer tokens
        # Update pools
        Approve()
    ])
    
    return Cond(
        [Txn.application_args[0] == Bytes("add_liquidity"), add_liquidity],
        [Txn.application_args[0] == Bytes("swap"), swap],
    )
```

#### Dispenser Contract
```python
# dispenser.py (PyTeal)
def dispenser_contract():
    # 1 ALGO = 100,000 WAM
    rate = Int(100000)
    
    buy_tokens = Seq([
        # Verify payment transaction
        Assert(Gtxn[0].type_enum() == TxnType.Payment),
        Assert(Gtxn[0].amount() > Int(0)),
        
        # Calculate WAM amount
        wam_amount = Gtxn[0].amount() * rate,
        
        # Transfer WAM tokens
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: wam_amount,
        }),
        InnerTxnBuilder.Submit(),
        
        Approve()
    ])
    
    return buy_tokens
```

### 3. Contract Deployment

```bash
# Install AlgoKit
pip install algokit

# Create new project
algokit init

# Deploy to TestNet
algokit deploy testnet
```

## 🛠 Development Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] ✅ Wallet integration (Pera Wallet)
- [x] ✅ TestNet configuration
- [ ] 🔄 Create WAM ASA token
- [ ] 🔄 Deploy dispenser contract
- [ ] 🔄 Test basic transactions

### Phase 2: Core Contracts (Week 3-4)
- [ ] 📝 AMM contract in PyTeal
- [ ] 📝 NFT minting contract
- [ ] 📝 Marketplace contract
- [ ] 🧪 Contract testing suite
- [ ] 🚀 TestNet deployment

### Phase 3: Integration (Week 5-6)
- [ ] 🔗 Frontend contract integration
- [ ] 💰 Token swapping UI
- [ ] 🎨 NFT minting flow
- [ ] 🏪 Marketplace functionality
- [ ] ⚡ Transaction optimization

### Phase 4: Advanced Features (Week 7-8)
- [ ] 🎮 Battle system contracts
- [ ] 🏆 Tournament mechanics
- [ ] 📊 Leaderboard system
- [ ] 🎁 Reward distribution
- [ ] 🔒 Security audit

### Phase 5: Production (Week 9-10)
- [ ] 🌐 MainNet deployment
- [ ] 📈 Performance monitoring
- [ ] 🐛 Bug fixes
- [ ] 📚 Documentation
- [ ] 🚀 Launch

## 🔧 Development Tools

### Essential Tools
```bash
# Algorand SDK
npm install algosdk

# Wallet connectors
npm install @perawallet/connect
npm install @blockshake/defly-connect

# Development tools
pip install pyteal
pip install algokit
```

### Useful Resources
- **Algorand Developer Portal**: https://developer.algorand.org
- **PyTeal Documentation**: https://pyteal.readthedocs.io
- **AlgoKit**: https://github.com/algorandfoundation/algokit-cli
- **TestNet Dispenser**: https://testnet.algoexplorer.io/dispenser
- **TestNet Explorer**: https://testnet.algoexplorer.io

## 💡 Key Differences from Ethereum

### Transaction Model
- **Atomic Transactions**: Group multiple operations
- **Fixed Fees**: ~0.001 ALGO per transaction
- **No Gas Estimation**: Predictable costs

### Asset Model
- **Native ASAs**: No smart contract needed for tokens
- **Built-in Features**: Freeze, clawback, reserve
- **Opt-in Required**: Users must opt-in to receive assets

### Smart Contracts
- **Stateful**: Global and local state
- **Stateless**: Logic signatures
- **TEAL**: Assembly-like language
- **PyTeal**: Python DSL for TEAL

## 🚀 Quick Start Commands

```bash
# Get TestNet ALGOs
curl -X POST https://testnet.algoexplorer.io/v1/faucet -d '{"address":"YOUR_ADDRESS"}'

# Check account info
goal account info -a YOUR_ADDRESS

# Create ASA
goal asset create --creator YOUR_ADDRESS --total 1000000 --unitname WAM --assetname "WAM Token"

# Deploy smart contract
goal app create --creator YOUR_ADDRESS --approval-prog approval.teal --clear-prog clear.teal
```

## 📋 Current Status

### ✅ Completed
- Pera Wallet integration
- TestNet configuration
- Frontend wallet connection
- Balance fetching
- Transaction signing setup

### 🔄 In Progress
- Smart contract development
- ASA token creation
- Contract deployment scripts

### 📝 Todo
- AMM implementation
- NFT contracts
- Marketplace contracts
- Battle system
- Production deployment

---

**Next Steps**: Create WAM ASA token and deploy dispenser contract to TestNet.
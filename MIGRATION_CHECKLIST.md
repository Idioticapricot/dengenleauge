# Algorand Migration Checklist

## ✅ Completed Files
- [x] `lib/algorand-config.ts` - Pera Wallet & Algod client setup
- [x] `components/wallet/AlgorandWalletProvider.tsx` - Algorand wallet context
- [x] `components/wallet/AlgorandConnectButton.tsx` - Algorand connect button
- [x] `BLOCKCHAIN_ELEMENTS.md` - Complete migration documentation

## 🔄 Next Steps

### 1. Install Dependencies
```bash
npm install algosdk @perawallet/connect
npm uninstall @web3-react/core @web3-react/injected-connector ethers viem wagmi
```

### 2. Update package.json
Remove EVM dependencies, keep algosdk and add @perawallet/connect.

### 3. Replace Wallet Integration
- Replace `WalletProvider` with `AlgorandWalletProvider` in `app/layout.tsx`
- Replace `ConnectWalletButton` with `AlgorandConnectButton` throughout app
- Update all `useWallet()` calls to `useAlgorandWallet()`

### 4. Files Needing Updates
- [ ] `app/layout.tsx` - Replace wallet provider
- [ ] All components using `useWallet()` hook
- [ ] Any components making blockchain transactions
- [ ] Smart contract interaction logic

### 5. Smart Contract Migration
- [ ] Create WAM as Algorand Standard Asset (ASA)
- [ ] Rewrite AMM contract in PyTeal/Teal
- [ ] Deploy dispenser as Algorand smart contract
- [ ] Update contract interaction code

### 6. Testing
- [ ] Test wallet connection on TestNet
- [ ] Test balance fetching
- [ ] Test transaction signing
- [ ] Full app functionality test

## Key Differences to Remember
- Algorand addresses are 58 characters (vs 42 for Ethereum)
- Balance in microAlgos (divide by 1,000,000 for ALGO)
- Transaction fees are fixed (~0.001 ALGO)
- No gas estimation needed
- Atomic transactions for complex operations
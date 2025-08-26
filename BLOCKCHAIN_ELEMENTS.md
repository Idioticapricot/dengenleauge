# Blockchain Elements in DengenLeague App

## Overview
This document lists all blockchain-related elements in the DengenLeague application and provides guidance for migrating to Algorand.

## Current Blockchain Stack: Avalanche C-Chain

### 1. Dependencies & Libraries
**File:** `package.json` (Lines 45-70)
- `@web3-react/core`: ^8.2.3
- `@web3-react/injected-connector`: ^6.0.7
- `algosdk`: latest (already included!)
- `ethers`: ^6.15.0
- `viem`: ^2.34.0
- `wagmi`: ^2.16.4

### 2. Smart Contracts (Solidity)

#### WAM Token Contract
**File:** `contracts/WAM.algo.ts` (Lines 1-14)
- ERC20 token implementation
- Mintable by owner
- Standard OpenZeppelin base

#### WAM Token with Dispenser
**File:** `contracts/Dispenser.also.ts` (Lines 1-52)
- ERC20 token with built-in AVAX exchange
- Rate: 1 AVAX = 100,000 WAM
- Owner withdrawal functions

#### AMM (Automated Market Maker)
**File:** `contracts/AMM.algo.ts` (Lines 1-140)
- WAM/WAVAX liquidity pool
- Add/remove liquidity functions
- Swap functions with slippage protection
- Constant product formula (x*y=k)

### 3. Contract ABIs
**Directory:** `abi/`
- `ERC20MarketplaceWithIndex.json`
- `GameEventEmitter.json`
- `MyNFT.json`
- `WamGameMulti.json`
- `WamWithDispenser.json`

### 4. Wallet Integration

#### Wallet Configuration
**File:** `lib/wallet-config.ts` (Lines 1-42)
- Wagmi configuration for Avalanche chains
- Supports Avalanche Fuji (testnet) and Mainnet
- Core Wallet and MetaMask detection
- WalletConnect integration

#### Wallet Provider
**File:** `components/wallet/WalletProvider.tsx` (Lines 1-150)
- React context for wallet state
- Chain switching functionality
- Balance tracking
- Connection management

#### Connect Button
**File:** `components/wallet/ConnectWalletButton.tsx` (Lines 1-60)
- Styled wallet connection component
- Connection status display
- Brutal UI design system

### 5. Environment Configuration
**File:** `.env` (Lines 1-12)
- Supabase configuration
- Database URLs
- External service keys (FAL, Pinata)

## Migration to Algorand

### Key Difference: EVM vs Non-EVM
Wagmi is EVM-specific and won't work with Algorand. Complete replacement needed.

### Required Changes

#### 1. Install Algorand Dependencies
```bash
npm install algosdk @perawallet/connect
npm uninstall @web3-react/core @web3-react/injected-connector ethers viem wagmi
```

#### 2. Create New Algorand Wallet Config
**File:** `lib/algorand-config.ts` (New)
```typescript
import PeraWalletConnect from "@perawallet/connect";
import algosdk from "algosdk";

export const peraWallet = new PeraWalletConnect({
  appName: "DengenLeague",
  network: "TestNet", // or "MainNet"
});

export const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);
```

#### 3. Replace Wallet Provider
**File:** `components/wallet/AlgorandWalletProvider.tsx` (New)
```typescript
import { createContext, useContext, useState, useEffect } from "react";
import { peraWallet, algodClient } from "../../lib/algorand-config";

const AlgorandWalletContext = createContext(null);

export const AlgorandWalletProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const connectedAccounts = await peraWallet.connect();
      setAccounts(connectedAccounts);
      if (connectedAccounts[0]) {
        await fetchBalance(connectedAccounts[0]);
      }
    } catch (e) {
      console.error("Connection failed:", e);
    }
    setConnecting(false);
  };

  const disconnectWallet = async () => {
    await peraWallet.disconnect();
    setAccounts([]);
    setBalance(0);
  };

  const fetchBalance = async (address) => {
    try {
      const accountInfo = await algodClient.accountInformation(address).do();
      setBalance(accountInfo.amount / 1000000); // Convert microAlgos to Algos
    } catch (e) {
      console.error("Balance fetch failed:", e);
    }
  };

  return (
    <AlgorandWalletContext.Provider
      value={{
        accounts,
        balance,
        connecting,
        connectWallet,
        disconnectWallet,
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
      }}
    >
      {children}
    </AlgorandWalletContext.Provider>
  );
};

export const useAlgorandWallet = () => useContext(AlgorandWalletContext);
```

#### 4. Update Connect Button
**File:** `components/wallet/AlgorandConnectButton.tsx` (New)
```typescript
import styled from "styled-components";
import { useAlgorandWallet } from "./AlgorandWalletProvider";

const ConnectButton = styled.button`
  /* Same styling as original */
`;

export function AlgorandConnectButton({ variant = "primary", children = "Connect Wallet" }) {
  const { isConnected, connecting, connectWallet, address } = useAlgorandWallet();

  if (isConnected) {
    return (
      <ConnectButton $variant={variant} disabled>
        🔗 {address?.slice(0, 6)}...{address?.slice(-4)}
      </ConnectButton>
    );
  }

  return (
    <ConnectButton 
      $variant={variant} 
      onClick={connectWallet} 
      disabled={connecting}
    >
      🔗 {connecting ? "Connecting..." : children}
    </ConnectButton>
  );
}
```

#### 5. Smart Contract Migration
- **WAM Token** → Create Algorand Standard Asset (ASA)
- **AMM Contract** → Rewrite in PyTeal/Teal with atomic transactions
- **Dispenser** → Algorand stateful smart contract (1 ALGO = 100k WAM)

### Step-by-Step Migration

#### Step 1: Install Dependencies
```bash
npm install algosdk @perawallet/connect
npm uninstall @web3-react/core @web3-react/injected-connector ethers viem wagmi
```

#### Step 2: Create Algorand Config
Create `lib/algorand-config.ts` with Pera Wallet and Algod client setup.

#### Step 3: Replace Wallet Provider
Replace `components/wallet/WalletProvider.tsx` with Algorand-specific context.

#### Step 4: Update Connect Button
Replace Wagmi hooks with Algorand wallet context in connect button.

#### Step 5: Update All Components
Find and replace all `useWallet()` calls with `useAlgorandWallet()`.

#### Step 6: Smart Contract Deployment
- Create WAM as Algorand Standard Asset
- Deploy AMM smart contract on Algorand
- Test on TestNet before MainNet

### Key Algorand Advantages

1. **Lower Fees**: ~0.001 ALGO per transaction vs variable gas fees
2. **Faster Finality**: 4.5 second block times
3. **Built-in Features**: Native ASAs, atomic transactions
4. **Sustainability**: Carbon-negative blockchain
5. **Developer Tools**: Excellent SDK and tooling

### Files Requiring Updates

- `lib/wallet-config.ts` → Complete rewrite for Algorand
- `components/wallet/WalletProvider.tsx` → Algorand wallet integration
- `components/wallet/ConnectWalletButton.tsx` → Update for Algorand wallets
- `contracts/*` → Rewrite in PyTeal/Teal
- `package.json` → Update dependencies
- All components using wallet functionality

### Estimated Migration Effort
- **Smart Contracts**: 2-3 weeks
- **Wallet Integration**: 1-2 weeks  
- **Frontend Updates**: 1-2 weeks
- **Testing & Deployment**: 1 week
- **Total**: 5-8 weeks
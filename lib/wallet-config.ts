import { createConfig, http } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected({
      target() {
        // Try Core Wallet first, then MetaMask as fallback
        if (typeof window !== 'undefined' && window.avalanche) {
          return {
            id: 'CoreWallet',
            name: 'Core',
            provider: window.avalanche,
          };
        } else if (typeof window !== 'undefined' && window.ethereum) {
          return {
            id: 'MetaMask',
            name: 'MetaMask',
            provider: window.ethereum,
          };
        }
        
        // Return mock provider for development
        return {
          id: 'MockWallet',
          name: 'Mock Wallet',
          provider: null,
        };
      },
    }),
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});

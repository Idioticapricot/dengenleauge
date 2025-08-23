import { createConfig, http } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [avalancheFuji, avalanche], // Fuji first for testnet
  connectors: [
    injected({
      target() {
        // Core Wallet detection for Avalanche
        if (typeof window !== 'undefined') {
          console.log('Checking for wallet providers...')
          console.log('window.avalanche:', window.avalanche)
          console.log('window.ethereum:', window.ethereum)
          
          // Check for Core Wallet
          if (window.avalanche) {
            console.log('Core Wallet detected!')
            return {
              id: 'CoreWallet',
              name: 'Core',
              provider: window.avalanche,
            }
          }
          
          // Check for MetaMask
          if (window.ethereum) {
            console.log('MetaMask detected!')
            return {
              id: 'MetaMask',
              name: 'MetaMask',
              provider: window.ethereum,
            }
          }
          
          console.log('No wallet providers detected')
        }
        
        return undefined
      },
    }),
    walletConnect({
      projectId: 'your-project-id', // You can get this from WalletConnect
      showQrModal: true,
    }),
  ],
  transports: {
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
})

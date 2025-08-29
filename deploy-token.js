const algosdk = require('algosdk');

// Algorand client configuration
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

// Token configuration
const DEGEN_TOKEN_CONFIG = {
  assetName: 'DengenLeague Token',
  unitName: 'DEGEN',
  total: 1_000_000_000,
  decimals: 6,
  defaultFrozen: false,
  url: 'https://dengenleague.com/token',
};

async function deployToken() {
  try {
    console.log('🚀 Starting DEGEN token deployment...');
    
    // Use the mnemonic from environment or hardcoded
    const mnemonic = process.env.CREATOR_MNEMONIC || 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
    
    // Derive account from mnemonic
    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log(`📍 Creator address: ${creatorAccount.addr}`);
    
    // Check balance
    const accountInfo = await algodClient.accountInformation(creatorAccount.addr).do();
    const balance = Number(accountInfo.amount) / 1e6;
    console.log(`💰 Account balance: ${balance} ALGO`);
    
    if (accountInfo.amount < 200000) {
      throw new Error('Insufficient balance. Need at least 0.2 ALGO');
    }
    
    // Get transaction parameters
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // Create asset creation transaction
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creatorAccount.addr,
      total: DEGEN_TOKEN_CONFIG.total,
      decimals: DEGEN_TOKEN_CONFIG.decimals,
      assetName: DEGEN_TOKEN_CONFIG.assetName,
      unitName: DEGEN_TOKEN_CONFIG.unitName,
      assetURL: DEGEN_TOKEN_CONFIG.url,
      defaultFrozen: DEGEN_TOKEN_CONFIG.defaultFrozen,
      suggestedParams,
    });
    
    console.log('📝 Transaction created');
    
    // Sign transaction
    const signedTxn = txn.signTxn(creatorAccount.sk);
    
    // Send transaction
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`📤 Transaction sent: ${txId}`);
    
    // Wait for confirmation
    const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetId = result['asset-index'];
    
    console.log('✅ SUCCESS!');
    console.log(`🎯 Asset ID: ${assetId}`);
    console.log(`🔍 Explorer: https://testnet.algoexplorer.io/asset/${assetId}`);
    console.log(`📋 Add this to your .env: DEGEN_ASSET_ID="${assetId}"`);
    
    return assetId;
    
  } catch (error) {
    console.error('❌ DEPLOYMENT FAILED');
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Run the deployment
deployToken();
const algosdk = require('algosdk');
const fetch = require('node-fetch');

async function deployTokenHTTP() {
  try {
    console.log('🚀 Starting DEGEN token deployment (HTTP API)...');
    
    const mnemonic = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonic);
    
    // Get transaction parameters via HTTP
    const paramsResponse = await fetch('https://testnet-api.algonode.cloud/v2/transactions/params');
    const params = await paramsResponse.json();
    
    console.log('📋 Got params via HTTP API');
    
    // Manually construct transaction
    const txn = {
      type: 'acfg',
      from: creatorAccount.addr,
      fee: 1000,
      firstRound: params['last-round'],
      lastRound: params['last-round'] + 1000,
      genesisID: params['genesis-id'],
      genesisHash: params['genesis-hash'],
      assetTotal: 1_000_000_000,
      assetDecimals: 6,
      assetDefaultFrozen: false,
      assetUnitName: 'DEGEN',
      assetName: 'DengenLeague Token',
      assetURL: 'https://dengenleague.com/token',
      assetManager: creatorAccount.addr,
      assetReserve: creatorAccount.addr,
      assetFreeze: creatorAccount.addr,
      assetClawback: creatorAccount.addr
    };
    
    // Create transaction object
    const transaction = new algosdk.Transaction(txn);
    const signedTxn = transaction.signTxn(creatorAccount.sk);
    
    // Send via HTTP
    const sendResponse = await fetch('https://testnet-api.algonode.cloud/v2/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-binary' },
      body: signedTxn
    });
    
    const result = await sendResponse.json();
    console.log('📤 Transaction sent via HTTP:', result.txId);
    
    return result.txId;
    
  } catch (error) {
    console.error('❌ HTTP DEPLOYMENT FAILED');
    console.error(`Error: ${error.message}`);
  }
}

deployTokenHTTP();
const algosdk = require('algosdk');

// Algorand client configuration
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

async function deployToken() {
  try {
    console.log('🚀 Starting DEGEN token deployment (FIXED VERSION)...');
    
    const mnemonic = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
    
    // Derive account from mnemonic
    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonic);
    const creatorAddress = creatorAccount.addr.toString(); // Ensure string
    console.log(`📍 Creator address: ${creatorAddress}`);
    
    // Check balance
    const accountInfo = await algodClient.accountInformation(creatorAddress).do();
    const balance = Number(accountInfo.amount) / 1e6;
    console.log(`💰 Account balance: ${balance} ALGO`);
    
    if (accountInfo.amount < 200000) {
      throw new Error('Insufficient balance. Need at least 0.2 ALGO');
    }
    
    // Get transaction parameters and convert BigInt to Number
    const params = await algodClient.getTransactionParams().do();
    const suggestedParams = {
      fee: Number(params.fee || params.minFee || 1000),
      firstRound: Number(params.firstValid),
      lastRound: Number(params.lastValid),
      genesisID: params.genesisID,
      genesisHash: params.genesisHash,
      flatFee: true
    };
    
    console.log('📝 Creating transaction with manual parameters...');
    
    // Use the older, more reliable function
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      creatorAddress,
      undefined, // note
      1_000_000_000, // total
      6, // decimals
      creatorAddress, // manager
      creatorAddress, // reserve  
      creatorAddress, // freeze
      creatorAddress, // clawback
      'DEGEN', // unitName
      'DengenLeague Token', // assetName
      'https://dengenleague.com/token', // url
      undefined, // metadataHash
      suggestedParams
    );
    
    console.log('📝 Transaction created successfully');
    
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
    console.error('Stack:', error.stack);
    throw error;
  }
}

// Run the deployment
deployToken();
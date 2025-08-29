const algosdk = require('algosdk');

async function deployToken() {
  try {
    console.log('🚀 Starting DEGEN token deployment (algosdk v2.7.0)...');
    
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const mnemonic = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
    
    // Derive account
    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log(`📍 Creator address: ${creatorAccount.addr}`);
    
    // Check balance
    const accountInfo = await algodClient.accountInformation(creatorAccount.addr).do();
    const balance = Number(accountInfo.amount) / 1e6;
    console.log(`💰 Account balance: ${balance} ALGO`);
    
    // Get transaction parameters
    const params = await algodClient.getTransactionParams().do();
    
    // Create asset creation transaction (v2.7.0 syntax)
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      creatorAccount.addr,
      undefined, // note
      1_000_000_000, // total
      6, // decimals
      false, // defaultFrozen
      creatorAccount.addr, // manager
      creatorAccount.addr, // reserve
      creatorAccount.addr, // freeze
      creatorAccount.addr, // clawback
      'DEGEN', // unitName
      'DengenLeague Token', // assetName
      'https://dengenleague.com/token', // url
      undefined, // metadataHash
      params
    );
    
    console.log('📝 Transaction created with v2.7.0');
    
    // Sign and send
    const signedTxn = txn.signTxn(creatorAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`📤 Transaction sent: ${txId}`);
    
    // Wait for confirmation
    const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetId = result['asset-index'];
    
    console.log('✅ SUCCESS!');
    console.log(`🎯 Asset ID: ${assetId}`);
    console.log(`🔍 Explorer: https://testnet.algoexplorer.io/asset/${assetId}`);
    console.log(`📋 Add this to your .env: DEGEN_ASSET_ID="${assetId}"`);
    
  } catch (error) {
    console.error('❌ DEPLOYMENT FAILED');
    console.error(`Error: ${error.message}`);
  }
}

deployToken();
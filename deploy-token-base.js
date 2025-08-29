const algosdk = require('algosdk');

async function deployToken() {
  try {
    console.log('🚀 Starting DEGEN token deployment (BASE FUNCTION)...');
    
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
    const mnemonic = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
    
    // Derive account
    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonic);
    const creatorAddress = creatorAccount.addr.toString();
    console.log(`📍 Creator address: ${creatorAddress}`);
    
    // Check balance
    const accountInfo = await algodClient.accountInformation(creatorAddress).do();
    const balance = Number(accountInfo.amount) / 1e6;
    console.log(`💰 Account balance: ${balance} ALGO`);
    
    // Get transaction parameters
    const params = await algodClient.getTransactionParams().do();
    console.log('📋 Raw params:', {
      fee: typeof params.fee,
      firstValid: typeof params.firstValid,
      lastValid: typeof params.lastValid
    });
    
    // Use makeBaseAssetConfigTxn directly
    const txn = algosdk.makeBaseAssetConfigTxn(
      creatorAddress,
      Number(params.fee || params.minFee || 1000),
      Number(params.firstValid),
      Number(params.lastValid),
      undefined, // note
      params.genesisHash,
      params.genesisID,
      0, // assetIndex (0 for creation)
      creatorAddress, // manager
      creatorAddress, // reserve
      creatorAddress, // freeze
      creatorAddress, // clawback
      'DEGEN', // unitName
      'DengenLeague Token', // assetName
      'https://dengenleague.com/token', // url
      undefined, // metadataHash
      1_000_000_000, // total
      6, // decimals
      false // defaultFrozen
    );
    
    console.log('📝 Transaction created with base function');
    
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
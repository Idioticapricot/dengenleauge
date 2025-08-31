oconst algosdk = require('algosdk');

// DEGEN Token Configuration (from contract)
const DEGEN_TOKEN_CONFIG = {
  total: 1000000000, // 1 billion tokens
  decimals: 6,
  defaultFrozen: false,
  unitName: 'DEGEN',
  assetName: 'DengenLeague Token',
  url: 'https://dengenleague.com/token',
};

// Configuration from .env
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const ALGOD_TOKEN = '';
const CREATOR_MNEMONIC = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';
const CREATOR_ADDRESS = 'G6NVGCO5UGJYXJ5H76RQDBVRA52VWZLGC44B7CERDY7DSYUZPRESHPJ4LE';
const EXISTING_DEGEN_ASSET_ID = '745007115'; // From .env

// Initialize Algod client
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

// Helper functions for DEGEN token operations
async function createDegenToken(algodClient, creatorAccount) {
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creatorAccount.addr,
    suggestedParams: params,
    ...DEGEN_TOKEN_CONFIG,
    manager: creatorAccount.addr,
    reserve: creatorAccount.addr,
    freeze: creatorAccount.addr,
    clawback: creatorAccount.addr,
  });

  const signedTxn = txn.signTxn(creatorAccount.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  return result['asset-index'];
}

async function transferDegenTokens(algodClient, senderAccount, receiverAddress, amount, assetId) {
  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: senderAccount.addr,
    to: receiverAddress,
    amount: amount * Math.pow(10, DEGEN_TOKEN_CONFIG.decimals),
    assetIndex: assetId,
    suggestedParams: params,
  });

  const signedTxn = txn.signTxn(senderAccount.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

  await algosdk.waitForConfirmation(algodClient, txId, 4);
  return txId;
}

async function createDegenAsset() {
  try {
    console.log('🚀 Creating DEGEN Asset...\n');

    // Get creator account from mnemonic
    console.log('🔑 Using mnemonic:', CREATOR_MNEMONIC.substring(0, 20) + '...');
    const creatorAccount = algosdk.mnemonicToSecretKey(CREATOR_MNEMONIC);
    console.log('📧 Creator Address:', creatorAccount.addr ? creatorAccount.addr.toString() : 'UNDEFINED');
    console.log('🔐 Has Secret Key:', !!creatorAccount.sk);

    // Validate account
    if (!creatorAccount.addr) {
      throw new Error('Creator account address is null or undefined. Check mnemonic.');
    }

    // Create the asset
    console.log('📝 Creating asset with config:');
    console.log('  - Name:', DEGEN_TOKEN_CONFIG.assetName);
    console.log('  - Unit:', DEGEN_TOKEN_CONFIG.unitName);
    console.log('  - Total Supply:', DEGEN_TOKEN_CONFIG.total.toLocaleString());
    console.log('  - Decimals:', DEGEN_TOKEN_CONFIG.decimals);
    console.log('');

    const assetId = await createDegenToken(algodClient, creatorAccount);

    console.log('✅ DEGEN Asset created successfully!');
    console.log('🆔 Asset ID:', assetId);
    console.log('🔗 View on Explorer:');
    console.log(`https://testnet.algoexplorer.io/asset/${assetId}`);

    return assetId;

  } catch (error) {
    console.error('❌ Error creating DEGEN asset:', error.message);
    throw error;
  }
}

async function transferDegenToCreator(assetId, amount = 1000) {
  try {
    console.log(`💸 Transferring ${amount} DEGEN to creator account...\n`);

    // For this demo, we'll assume the creator is also the sender
    // In a real scenario, you'd have a separate dispenser/minter account
    console.log('🔑 Using mnemonic:', CREATOR_MNEMONIC.substring(0, 20) + '...');
    const senderAccount = algosdk.mnemonicToSecretKey(CREATOR_MNEMONIC);
    const receiverAddress = CREATOR_ADDRESS;

    // Ensure assetId is a number
    const numericAssetId = parseInt(assetId);
    console.log('📤 From:', senderAccount.addr ? senderAccount.addr.toString() : 'UNDEFINED');
    console.log('🔐 Has Secret Key:', !!senderAccount.sk);
    console.log('📥 To:', receiverAddress);
    console.log('🆔 Asset ID:', numericAssetId, '(type:', typeof numericAssetId, ')');
    console.log('💰 Amount:', amount, 'DEGEN');

    // Validate sender account
    if (!senderAccount.addr) {
      throw new Error('Sender account address is null or undefined. Check mnemonic.');
    }

    // Validate asset ID
    if (isNaN(numericAssetId) || numericAssetId <= 0) {
      throw new Error('Invalid asset ID: must be a positive number');
    }

    console.log('');

    const txId = await transferDegenTokens(algodClient, senderAccount, receiverAddress, amount, numericAssetId);

    console.log('✅ DEGEN transfer successful!');
    console.log('🔗 Transaction ID:', txId);
    console.log('🔗 View on Explorer:');
    console.log(`https://testnet.algoexplorer.io/tx/${txId}`);

    return txId;

  } catch (error) {
    console.error('❌ Error transferring DEGEN:', error.message);
    throw error;
  }
}

async function checkExistingAsset(assetId) {
  try {
    console.log('🔍 Checking existing DEGEN asset...\n');

    const assetInfo = await algodClient.getAssetByID(assetId).do();

    console.log('✅ Asset found!');
    console.log('📄 Asset Name:', assetInfo.params.name);
    console.log('🏷️  Unit Name:', assetInfo.params['unit-name']);
    console.log('📊 Total Supply:', Number(assetInfo.params.total) / Math.pow(10, assetInfo.params.decimals));
    console.log('🔢 Decimals:', assetInfo.params.decimals);
    console.log('👤 Creator:', assetInfo.params.creator);
    console.log('');

    return true;

  } catch (error) {
    console.log('ℹ️  Asset not found or error checking asset:', error.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🎯 DEGEN Token Management Script\n');
    console.log('=' .repeat(50));

    // Check if asset already exists
    console.log('Step 1: Check existing asset');
    const assetExists = await checkExistingAsset(EXISTING_DEGEN_ASSET_ID);

    let assetId = EXISTING_DEGEN_ASSET_ID;

    if (!assetExists) {
      console.log('Step 2: Create new DEGEN asset');
      assetId = await createDegenAsset();
    } else {
      console.log('Step 2: Asset already exists, skipping creation');
    }

    console.log('\n' + '='.repeat(50));
    console.log('Step 3: Transfer DEGEN to creator account');

    // Transfer some DEGEN to the creator account for testing
    // Note: Asset has only 1000 total supply, so we can only transfer what's available
    await transferDegenToCreator(assetId, 100); // Transfer 100 DEGEN for testing

    console.log('\n' + '='.repeat(50));
    console.log('🎉 DEGEN token setup completed!');
    console.log('📋 Summary:');
    console.log('- Asset ID:', assetId);
    console.log('- Creator funded with DEGEN tokens');
    console.log('- Ready for atomic swap testing');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createDegenAsset, transferDegenToCreator, checkExistingAsset };
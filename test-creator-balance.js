const algosdk = require('algosdk');

// Configuration from .env
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const ALGOD_TOKEN = '';
const DEGEN_ASSET_ID = '745007115';
const CREATOR_MNEMONIC = 'ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste';

// Initialize Algod client
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

async function testCreatorBalance() {
  try {
    console.log('🔍 Testing Creator Account Balance...\n');

    // Get creator account from mnemonic
    const creatorAccount = algosdk.mnemonicToSecretKey(CREATOR_MNEMONIC);
    const creatorAddress = creatorAccount.addr.toString();

    console.log('📧 Creator Address:', creatorAddress);
    console.log('🔑 Creator Mnemonic:', CREATOR_MNEMONIC);
    console.log('🆔 DEGEN Asset ID:', DEGEN_ASSET_ID);
    console.log('');

    // Get account information
    console.log('📡 Fetching account information...');
    const accountInfo = await algodClient.accountInformation(creatorAddress).do();

    console.log('✅ Account info retrieved successfully!');
    console.log('💰 ALGO Balance:', (Number(accountInfo.amount) / 1e6).toFixed(6), 'ALGO');
    console.log('');

    // Check DEGEN balance
    const assets = accountInfo.assets || [];
    const degenAsset = assets.find(asset => asset['asset-id'] === parseInt(DEGEN_ASSET_ID));

    if (degenAsset) {
      const degenBalance = Number(degenAsset.amount) / 1e6;
      console.log('🎯 DEGEN Balance:', degenBalance.toFixed(6), 'DEGEN');
      console.log('📊 Asset ID Match:', degenAsset['asset-id'] === parseInt(DEGEN_ASSET_ID) ? '✅' : '❌');
    } else {
      console.log('🎯 DEGEN Balance: 0 DEGEN (not opted in or no balance)');
      console.log('💡 Note: Creator account may need to opt-in to DEGEN asset first');
    }

    console.log('');
    console.log('🔗 View on Explorer:');
    console.log(`https://testnet.algoexplorer.io/address/${creatorAddress}`);

  } catch (error) {
    console.error('❌ Error testing creator balance:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testCreatorBalance();
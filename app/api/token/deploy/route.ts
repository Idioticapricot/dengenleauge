import { NextResponse } from 'next/server'
import * as algosdk from 'algosdk'

/**
 * ==================================================================
 * FINAL, BULLETPROOF TOKEN DEPLOYMENT SCRIPT
 * ------------------------------------------------------------------
 * This version bypasses the high-level transaction builders and
 * constructs the transaction manually to avoid deep SDK bugs.
 * ==================================================================
 */

// --- 1. ALGORAND CLIENT CONFIGURATION ---
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

// --- 2. TOKEN DEFINITION (ASA) ---
const DEGEN_TOKEN_CONFIG = {
  assetName: 'DengenLeague Bulletproof',
  unitName: 'DGN-B',
  total: 1_000_000_000,
  decimals: 6,
  defaultFrozen: false,
  url: 'https://dengenleague.com',
};

export async function POST(request: Request) {
  console.log('--- Bulletproof Deployment API Triggered ---');
  try {
    // --- 3. GET AND SANITIZE MNEMONIC ---
    const { creatorMnemonic } = await request.json();
    if (!creatorMnemonic || typeof creatorMnemonic !== 'string') {
      return NextResponse.json({ success: false, error: 'creatorMnemonic (string) is required.' }, { status: 400 });
    }
    const sanitizedMnemonic = creatorMnemonic.trim().split(/\s+/).join(' ');

    // --- 4. DERIVE ACCOUNT AND CHECK BALANCE ---
    const creatorAccount = algosdk.mnemonicToSecretKey(sanitizedMnemonic);
    const accountInfo = await algodClient.accountInformation(creatorAccount.addr).do();
    const balance = BigInt(accountInfo.amount);

    console.log('--- Account Details ---');
    console.log(`Address: ${creatorAccount.addr}`);
    console.log(`Balance: ${Number(balance) / 1e6} ALGO`);
    console.log('---------------------');

    if (balance < 200000n) {
      return NextResponse.json({ success: false, error: `Insufficient balance. At least 0.2 ALGO is required.` }, { status: 400 });
    }

    // --- 5. MANUALLY CONSTRUCT THE TRANSACTION ---
    const suggestedParams = await algodClient.getTransactionParams().do();

    // FINAL FIX: Manually build the transaction object to bypass the buggy high-level functions.
    const txn = new algosdk.Transaction({
        from: creatorAccount.addr.toString(),
        ...suggestedParams,
        type: 'acfg', // Asset Configuration Transaction
        assetTotal: DEGEN_TOKEN_CONFIG.total,
        assetDecimals: DEGEN_TOKEN_CONFIG.decimals,
        assetDefaultFrozen: DEGEN_TOKEN_CONFIG.defaultFrozen,
        assetUnitName: DEGEN_TOKEN_CONFIG.unitName,
        assetName: DEGEN_TOKEN_CONFIG.assetName,
        assetURL: DEGEN_TOKEN_CONFIG.url,
        // Omit manager, reserve, freeze, and clawback for an immutable token
    });
    console.log('Transaction manually constructed.');

    // --- 6. SIGN AND SEND ---
    const signedTxn = txn.signTxn(creatorAccount.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(`Transaction sent. TxID: ${txId}`);

    // --- 7. WAIT FOR CONFIRMATION ---
    const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetId = result['asset-index'];

    if (!assetId) {
        throw new Error("Deployment succeeded, but no Asset ID was returned.");
    }

    // --- 8. SUCCESS ---
    console.log(`✅ Successfully deployed token! Asset ID: ${assetId}`);
    return NextResponse.json({
      success: true,
      assetId: assetId,
      explorerUrl: `https://testnet.algoexplorer.io/asset/${assetId}`
    });

  } catch (error: any) {
    console.error('--- 🚨 DEPLOYMENT FAILED 🚨 ---');
    console.error(`Error: ${error.message}`);
    return NextResponse.json({ success: false, error: error.message || 'An unknown error occurred.' }, { status: 500 });
  }
}

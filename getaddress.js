// verifyAddress.js
import algosdk from 'algosdk';

// This is the mnemonic we are testing
const mnemonic = "ecology symptom bean enter elbow adapt gate toward wild book cram practice delay bright gold during bicycle bachelor pizza candy harsh very foot absorb taste";

console.log("--- Verifying Mnemonic ---");
console.log("Mnemonic Phrase:", mnemonic);

try {
  const account = algosdk.mnemonicToSecretKey(mnemonic);
  // We will convert the resulting address object to a string
  console.log("✅ Corresponding Address:", account.addr.toString()); 
} catch (e) {
  console.error("❌ Error: The mnemonic provided is invalid.", e.message);
}

console.log("--------------------------");
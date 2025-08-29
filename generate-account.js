import algosdk from 'algosdk';

const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

console.log("Your new Algorand TestNet account:");
console.log("Address:", account.addr.toString());
console.log("Mnemonic:", mnemonic);

console.log("\nNext steps:");
console.log("1. Go to https://testnet.algoexplorer.io/dispenser");
console.log("2. Fund this address with testnet ALGO");
console.log("3. Use the mnemonic in /admin to deploy DEGEN token");
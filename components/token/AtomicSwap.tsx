<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atomic Swap Component</title>
    <!-- React Libraries -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel for JSX transpilation -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Algorand SDK -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/algosdk/2.7.0/algosdk.min.js"></script>

    <style>
        :root {
            --brutal-yellow: #ffc700;
            --border-primary: #000000;
            --text-primary: #000000;
            --brutal-cyan: #00c7ff;
            --light-bg: #ffffff;
            --primary-green: #00ff87;
            --brutal-red: #ff5470;
            --font-mono: 'Courier New', Courier, monospace;
        }

        body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }

        #root {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .swap-card {
            background: var(--brutal-yellow);
            border: 4px solid var(--border-primary);
            padding: 32px;
            box-shadow: 8px 8px 0px 0px var(--border-primary);
            max-width: 400px;
            width: 100%;
        }

        .card-title {
            font-size: 24px;
            font-weight: 900;
            color: var(--text-primary);
            margin: 0 0 20px 0;
            font-family: var(--font-mono);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
        }

        .rate-display {
            background: var(--light-bg);
            border: 3px solid var(--border-primary);
            padding: 12px;
            text-align: center;
            margin-bottom: 20px;
            box-shadow: 3px 3px 0px 0px var(--border-primary);
        }

        .rate-text {
            font-size: 16px;
            font-weight: 900;
            color: var(--text-primary);
            font-family: var(--font-mono);
        }

        .input-label {
            font-size: 14px;
            font-weight: 900;
            color: var(--text-primary);
            font-family: var(--font-mono);
            text-transform: uppercase;
            display: block;
            margin-bottom: 8px;
        }

        .preset-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }

        .preset-button {
            padding: 8px 12px;
            border: 2px solid var(--border-primary);
            background: var(--light-bg);
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .preset-button:hover {
            background: var(--brutal-cyan);
            transform: translate(-1px, -1px);
        }

        .preset-button:active {
            transform: translate(0px, 0px);
        }
        
        .preset-button.active {
            background: var(--brutal-cyan);
        }

        .input {
            width: 100%;
            padding: 12px;
            border: 3px solid var(--border-primary);
            background: var(--light-bg);
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 12px;
            box-shadow: 3px 3px 0px 0px var(--border-primary);
            box-sizing: border-box;
        }

        .input:focus {
            outline: none;
            background: var(--brutal-cyan);
        }

        .preview-text {
            font-size: 14px;
            font-weight: 700;
            color: var(--primary-green);
            font-family: var(--font-mono);
            margin-bottom: 20px;
            text-align: center;
        }

        .info-box {
            background: var(--brutal-cyan);
            border: 2px solid var(--border-primary);
            padding: 12px;
            margin-bottom: 16px;
            box-shadow: 2px 2px 0px 0px var(--border-primary);
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-mono);
            text-align: center;
        }
        
        .result-box {
            border: 3px solid var(--border-primary);
            padding: 16px;
            margin-top: 16px;
            box-shadow: 3px 3px 0px 0px var(--border-primary);
        }
        
        .result-box.success {
            background: var(--primary-green);
        }

        .result-box.error {
            background: var(--brutal-red);
        }

        .result-text {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-mono);
            word-wrap: break-word;
        }
        
        .explorer-link {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-primary);
            font-family: var(--font-mono);
            text-decoration: underline;
            margin-top: 8px;
            display: block;
        }

        .explorer-link:hover {
            color: var(--brutal-cyan);
        }

        .button {
            background: var(--brutal-yellow);
            border: 3px solid var(--border-primary);
            box-shadow: 4px 4px 0px 0px var(--border-primary);
            padding: 12px 24px;
            font-family: var(--font-mono);
            font-weight: 900;
            font-size: 16px;
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }

        .button:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px var(--border-primary);
        }

        .button:active {
            transform: translate(0, 0);
            box-shadow: 4px 4px 0px 0px var(--border-primary);
        }

        .button:disabled {
            background-color: #ccc;
            color: #888;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- Mock Functions for Environment Simulation ---
        // In a real application, these would be provided by wallet libraries.
        // We mock them here to make the component runnable.
        
        const useWallet = () => {
            const [activeAddress, setActiveAddress] = useState('5AF5PA2L7M2Y4A5Y5J3J5Q5Z5B5V5X5W5H5U5P5I5V5R5U5N5Z5K5M');

            const signTransactions = async (txns) => {
                console.log("MOCK: Signing transactions:", txns);
                // In a real app, this prompts the user. Here, we just log and return.
                // We must return a Uint8Array, so we'll just return the input.
                window.alert('This is a simulated wallet signature. Check the developer console for details.');
                return txns;
            };

            return { activeAddress, signTransactions };
        };

        const useAlgorandWallet = () => {
            const fetchBalance = (address) => {
                console.log(`MOCK: Fetching balance for ${address}`);
            };
            return { fetchBalance };
        };

        // Mock the fetch API to simulate backend responses
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            if (url === '/api/atomic-swap') {
                console.log(`MOCK: Intercepted fetch for ${url} with method ${options.method}`);

                if (options.method === 'POST') {
                    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
                    const body = JSON.parse(options.body);
                    const algoAmount = body.algoAmount;
                    
                    // Simulate creating transaction data
                    const encoder = new TextEncoder();
                    const fakeOptInTxn = { txn: Array.from(encoder.encode(`opt-in-txn-for-${algoAmount}`)) };
                    const fakePaymentTxn = { txn: Array.from(encoder.encode(`payment-txn-for-${algoAmount}`)) };
                    const fakeCreatorTxn = { txn: Array.from(encoder.encode(`creator-txn-for-${algoAmount}`)) };
                    
                    return new Response(JSON.stringify({
                        success: true,
                        data: {
                            transactions: [fakeOptInTxn, fakePaymentTxn, fakeCreatorTxn],
                            signedCreatorTransaction: Array.from(encoder.encode(`signed-creator-txn-for-${algoAmount}`))
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }

                if (options.method === 'PUT') {
                    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay
                    const txId = `MOCK_TX_ID_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
                    return new Response(JSON.stringify({
                        success: true,
                        data: {
                            txId: txId,
                            explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
                        }
                    }), { headers: { 'Content-Type': 'application/json' } });
                }
            }
            return originalFetch(url, options);
        };
        
        // --- React Component ---

        function AtomicSwap() {
            const { activeAddress, signTransactions } = useWallet();
            const { fetchBalance } = useAlgorandWallet();
            const [algoAmount, setAlgoAmount] = useState('');
            const [loading, setLoading] = useState(false);
            const [result, setResult] = useState(null);

            const handleAtomicSwap = async () => {
                if (!activeAddress || !algoAmount) return;

                if (!signTransactions) {
                    setResult({ error: 'Wallet signTransactions function not available.' });
                    return;
                }

                setLoading(true);
                setResult(null);

                try {
                    // Step 1: Call POST endpoint to create atomic swap
                    const response = await fetch('/api/atomic-swap', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            buyerAddress: activeAddress,
                            algoAmount: parseFloat(algoAmount)
                        })
                    });
                    const data = await response.json();
                    if (!data.success || !data.data || !data.data.transactions) {
                        throw new Error(data.error || 'Failed to get transactions from server.');
                    }
                    
                    const txnGroup = data.data.transactions.map(txnData => new Uint8Array(txnData.txn));
                    const paymentTxn = txnGroup[1]; // Payment transaction only for Pera compatibility
                    
                    // Step 2: Sign the transaction
                    const signedTxns = await signTransactions([paymentTxn]);

                    if (!signedTxns || !Array.isArray(signedTxns) || signedTxns.length === 0) {
                        throw new Error('Wallet failed to sign payment transaction.');
                    }
                    
                    const signedUserTransaction = [Array.from(signedTxns[0])];
                    const signedCreatorTransaction = data.data.signedCreatorTransaction;

                    // Step 3: Send signed transactions to PUT endpoint
                    const submitResponse = await fetch('/api/atomic-swap', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            signedUserTransaction,
                            signedCreatorTransaction
                        })
                    });
                    
                    const submitResult = await submitResponse.json();
                    if (submitResult.success && submitResult.data) {
                        setResult({
                            success: true,
                            txId: submitResult.data.txId,
                            explorerUrl: submitResult.data.explorerUrl,
                            degenAmount: parseFloat(algoAmount) * 100
                        });
                        setAlgoAmount('');
                        if (activeAddress) {
                            setTimeout(() => fetchBalance(activeAddress), 2000);
                        }
                    } else {
                        throw new Error(submitResult.error || 'Transaction failed or server returned an invalid response.');
                    }

                } catch (error) {
                    console.error('Atomic swap failed:', error);
                    setResult({ error: error.message });
                } finally {
                    setLoading(false);
                }
            };

            const calculateDegenAmount = () => {
                if (!algoAmount) return 0;
                return parseFloat(algoAmount) * 100;
            };

            const handlePresetClick = (degenAmount) => {
                const requiredAlgo = degenAmount / 100;
                setAlgoAmount(requiredAlgo.toString());
            };

            const presetOptions = [
                { degen: 10, algo: 0.1 },
                { degen: 25, algo: 0.25 },
                { degen: 50, algo: 0.5 }
            ];

            return (
                <div className="swap-card">
                    <h2 className="card-title">⚡ ATOMIC SWAP</h2>
                    
                    <div className="rate-display">
                        <div className="rate-text">1 ALGO = 100 DEGEN</div>
                    </div>

                    <div className="info-box">
                        🔄 Atomic Transaction - Instant & Safe!<br/>
                        Both transactions execute together or both fail
                    </div>

                    <label className="input-label">Quick Buy Options</label>
                    <div className="preset-buttons">
                        {presetOptions.map((option) => (
                            <button
                                key={option.degen}
                                className={`preset-button ${parseFloat(algoAmount) === option.algo ? 'active' : ''}`}
                                onClick={() => handlePresetClick(option.degen)}
                            >
                                {option.degen} DEGEN<br/>
                                <small>{option.algo} ALGO</small>
                            </button>
                        ))}
                    </div>

                    <label className="input-label">Or Enter ALGO Amount</label>
                    <input
                        type="number"
                        className="input"
                        placeholder="Enter ALGO amount"
                        value={algoAmount}
                        onChange={(e) => setAlgoAmount(e.target.value)}
                        min="0.01"
                        max="1"
                        step="0.01"
                    />

                    {algoAmount && (
                        <div className="preview-text">
                            You will receive: {calculateDegenAmount().toLocaleString()} DEGEN
                        </div>
                    )}

                    <button 
                        className="button"
                        onClick={handleAtomicSwap}
                        disabled={!activeAddress || !algoAmount || loading}
                    >
                        {loading ? '🔄 SWAPPING...' : '⚡ ATOMIC SWAP'}
                    </button>

                    {!activeAddress && (
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--brutal-red)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginTop: '16px' }}>
                            Connect your wallet to swap
                        </div>
                    )}

                    {result && (
                        <div className={`result-box ${result.error ? 'error' : 'success'}`}>
                            {result.error ? (
                                <p className="result-text">❌ Error: {result.error}</p>
                            ) : (
                                <>
                                    <p className="result-text">
                                        ✅ Atomic swap successful!<br/>
                                        Received: {result.degenAmount.toLocaleString()} DEGEN
                                    </p>
                                    <a 
                                        href={result.explorerUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="explorer-link"
                                    >
                                        View transaction on explorer
                                    </a>
                                </>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);
        root.render(<AtomicSwap />);
    </script>
</body>
</html>

import { formatNumberToBalance,getDecimals, initialize, getKeyringFromSeed, isValidAddress } from "avail-js-sdk"
// import { networks } from "./config.js";
// import config from "./config.js";

const config =  {
  mnemonic: "Alice Bob", // Your mnemonic
  ApiURL: "wss://goldberg.avail.tools/ws", // not suggest http-endpoint
  app_id: 0,
  amount: 1,
  receiver: "5EUyqiZYWAwj4qqGQrzkaJeH5x2WMaY4cfMpKZztJ4NWH53Q" // avail testnet addr
  // 5EUyqiZYWAwj4qqGQrzkaJeH5x2WMaY4cfMpKZztJ4NWH53Q 5G6o45EjyZko8v6uGuUbRiM8AdykVQehFUSJuH33BBeEYEw7
}

const networks = {
  'goldberg': {
      rpcEndpoint: 'wss://goldberg.avail.tools/ws',
      ss58Format: 42,
      decimals: 18,
      rpcEndpoints: [
          {
              label: 'Avail Goldberg',
              key: 'wss://goldberg.avail.tools/ws'
          }
  ]
  },
};

async function transferAvail() {
  try {
    if (!isValidAddress(config.receiver)) throw new Error("Invalid Recipient")

    const api = await initialize(config.ApiURL)
    const keyring = getKeyringFromSeed(config.mnemonic)
    const options = { app_id: 0, nonce: -1 }
    const decimals = getDecimals(api)
    const amount = formatNumberToBalance(config.amount, decimals)

    const transfer = api.tx.balances.transfer(config.receiver, amount)
    await transfer.signAndSend(keyring, options)
    process.exit(0)
        
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
}

// avail testnet inscription $BLOB
async function mintBlob(times) {
  const api = await initialize(config.ApiURL)
  const keyring = getKeyringFromSeed(config.mnemonic)
  api.setSigner(keyring) // important
  const network = networks

  const payload = {
    p: "avc-20",
    op: "mint",
    tick: "BLOB",
    amt: "1000",
  };
  const remarkTx = api.tx.system.remarkWithEvent(JSON.stringify(payload));
  for (let i = 0; i < times; i++) {
    console.log(`执行第${i+1}次`)
    await executeTx({
      api: api,
      apiReady: true,
      network: network,
      tx: remarkTx,
      // address: '5G6o45EjyZko8v6uGuUbRiM8AdykVQehFUSJuH33BBeEYEw7',
      params: keyring
    });
    await new Promise(resolve => setTimeout(resolve,500)) // wait 0.5s
  }
}

async function executeTx({ api, apiReady, tx, params}){
  if (!api || !apiReady || !tx) return;
  return new Promise((resolve, reject) => {
    tx.signAndSend(params, async ({ status, events, txHash }) => {
        try {
            if (status.isInvalid) {
                console.log('Transaction invalid');
                reject(new Error('Transaction invalid'));
            } else if (status.isReady) {
                console.log('Transaction is ready');
            } else if (status.isBroadcast) {
                console.log('Transaction has been broadcasted');
            } else if (status.isInBlock) {
                console.log('Transaction is in block');
            } else if (status.isFinalized) {
                console.log(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`);
                resolve(status.asFinalized.toHex());
            }
        } catch (error) {
            console.error('Error in transaction:', error.message);
            reject(error);
        }
    });
  });
};

mintBlob(times) // times 次数

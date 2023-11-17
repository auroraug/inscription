const {ethers} = require('ethers')
// Your Alchemy RPC_URL
const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/OeOqXirNX9l9IQrHYDiv9TNrdyKOS2Qd')
// Your wallet private key
const wallet = new ethers.Wallet(Private_Key,provider)
const receiver = wallet.address
// inscription content, whatever you want
const data = 'data:,{"p":"prc-20","op":"mint","tick":"pols","amt":"100000000"}'
let buffer = Buffer.from(data, 'utf-8');

async function main() {
    while(true) {
        try {
            const nonce = await wallet.getNonce()
            const feedata = await provider.getFeeData();
            const transactions = []
            // batch mint, i: count
            for (var i=0;i < 10;i++) {
                // peak mint period
                // const exampleTx = {
                //     type: 2,
                //     nonce: nonce,
                //     gasLimit: 3000000,
                //     maxFeePerGas: feedata.maxFeePerGas+BigInt(1e12), // maxFee is 1000Gwei greater than others
                //     maxPriorityFeePerGas: feedata.maxPriorityFeePerGas+BigInt(5e11), // maxPriorityFee is 500Gwei greater than others
                //     to: receiver,
                //     data: `0x${buffer.toString('hex')}`,
                // }
                // low congestion period
                const tx = {
                    type: 2,
                    nonce: nonce+i,
                    gasLimit: 3000000,
                    maxFeePerGas: feedata.maxFeePerGas+BigInt(1e11), // maxFee is 100Gwei greater than others
                    maxPriorityFeePerGas: feedata.maxPriorityFeePerGas+BigInt(5e10), // maxPriorityFee is 50Gwei greater than others
                    to: receiver,
                    data: `0x${buffer.toString('hex')}`,
                }
                transactions.push(tx)
            }
            const responses = await Promise.all(transactions.map(transaction => wallet.sendTransaction(transaction)))
            await Promise.all(responses.map(res => res.wait()))
        } catch (error) {
            console.log(error.message)
        }
        await sleep(5000)
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve,ms))
}

main()

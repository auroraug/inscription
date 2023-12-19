// Public Celestia_PRC head to https://docs.celestia.org/nodes/mainnet

require('dotenv').config();
const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const {base64FromBytes} = require("cosmjs-types/helpers");

async function execute(wallet, fee, numberOfTimes) {
    for (let i = 0; i < numberOfTimes; i++) {
        console.log(`第${i + 1}次开始`)
        try {
            const address = 'celestia17j8c9ka9gs593k7q70uz80sknezj33lthp45nz'
            const amount = coins(1, "utia");
            const memo = 'data:,{"op":"mint","amt":10000,"tick":"cias","p":"cia-20"}';
            const RpcEndpoint = process.env.CELESTIA_RPC;
            const gasPrice = GasPrice.fromString("0.025utia");
            // ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ
            const client = await SigningStargateClient.connectWithSigner(RpcEndpoint, wallet, { gasPrice: gasPrice });
            const result = await client.sendTokens(address, address, amount, fee, base64FromBytes(Buffer.from(memo, 'utf8')));
            console.log(`${address}, 第 ${i + 1} 次操作成功: ${'https://celenium.io/tx/' + result.transactionHash}`);
            await sleep(1000);
        } catch (error) {
            console.error(`第 ${i + 1} 次操作失败: `, error);
        }
    }
}

// 'ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ=='
function base64StringToMemo(_base64String) {
    const decodedBuffer = Buffer.from(_base64String,'base64')
    return decodedBuffer.toString('utf8')
}

function sleep(ms) {
    return new Promise(res => setTimeout(res,ms));
}

async function main() {
    const privateKey = process.env.PRIVATE_KEY1;
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(`cfb305a${privateKey}ace161`, "hex"), "celestia");
    const fee = {
        amount: coins(9200, "utia"), // 2200 - 10000
        gas: "90000", // 80000 - 100000
    };
    
    const balance = await client.getBalance(walletAddress, "utia");
    console.log(`地址: ${walletAddress} 余额: ${parseFloat(balance.amount) / 1000000}`);

    await execute(wallet, fee, 5000)
        .then(() => {
            console.log('All operactions has been done!');
        })
        .catch(error => {
            console.error('Error occurred!', error);
        });
}

// main();
// console.log(base64StringToMemo('ZGF0YToseyJvcCI6Im1pbnQiLCJhbXQiOjEwMDAwLCJ0aWNrIjoiY2lhcyIsInAiOiJjaWEtMjAifQ=='))

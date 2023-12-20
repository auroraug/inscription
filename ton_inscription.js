// refer to https://github.com/toncenter/tonweb && https://docs.ton.org/develop/dapps/ton-connect/transactions#transfer-with-comment && https://docs.tonano.io/introduction/overview
// ton explorer https://tonscan.org/
const {mnemonicToPrivateKey} = require('@ton/crypto')
const TonWeb = require('tonweb');
// const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_MAINNET_TONCENTER_API_KEY'}));
const tonweb = new TonWeb(new TonWeb.HttpProvider("https://mainnet.tonhubapi.com/jsonRPC"));
const WalletClass = tonweb.wallet.all.v4R2;
// your mnemon 助记词 here
const mnemonic = ``

async function main(times) {
  const mnemonicArray = mnemonic.split(' ');
  let keyPair = await mnemonicToPrivateKey(mnemonicArray);
  const wallet = new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey });
  
  while(times>0) {
    const seqno = await wallet.methods.seqno().call();
    // 4 transfer per mint
    const transfer = wallet.methods.transfers({
        seqno: seqno,
        secretKey: keyPair.secretKey,
        messages: [
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload: 'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload: 'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload: 'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
            {
                toAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
                amount: TonWeb.utils.toNano("0"),
                payload: 'data:application/json,{"p":"ton-20","op":"mint","tick":"nano","amt":"100000000000"}',
            },
        ],
    });
    const result = await transfer.send();
    console.log(result)
    times--;
    await sleep(5000) // wait 5 seconds
  }
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res,ms));
}

main(10).catch(console.error)

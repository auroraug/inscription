const {ethers} = require('ethers')
const provider = new ethers.JsonRpcProvider(' https://mainnet.era.zksync.io ')
const privateKey = [/**private key array */]
const Wallet = privateKey.map(p => new ethers.Wallet(p,provider))

async function main() {
    const transactions = await Promise.all(Wallet.map(wallet => createTx(wallet)))
    if(transactions.length == Wallet.length) {
        for (let index = 0; index < Wallet.length; index++) {
            const tx = await Wallet[index].sendTransaction(transactions[index]);
            await tx.wait()
            await sleep(1000) // 1s
            console.log('TxHash:',tx.hash)
        }
    }
}
main()

async function createTx(wallet) {
    try {
        const [amount] = await fetch(`https://www.zksyncpepe.com/resources/amounts/${wallet.toLowerCase()}.json`, {
            method: 'GET'
        })
        .then(async(response) => {
            return await response.json()
        })
        const proof = await fetch(`https://www.zksyncpepe.com/resources/proofs/${wallet.toLowerCase()}.json`, {
            method: 'GET'
        }).then(async(response) => {
            return await response.json()
        })
        const calldata = '0x3b439351'+ethers.AbiCoder.defaultAbiCoder().encode(['bytes32[]','uint256'],[proof,ethers.parseUnits(amount.toString(),18)]).substring(2)
        const tx = {
            to: '0x95702a335e3349d197036Acb04BECA1b4997A91a',
            value: 0,
            gasPrice: ethers.parseUnits('0.25','gwei'),
            gasLimit: 500000,
            data: calldata
        }
        return tx;
    } catch (error) {
        console.log(error.message)
    }
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res,ms));
}

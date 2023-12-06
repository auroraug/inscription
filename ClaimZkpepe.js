const {ethers} = require('ethers')
const provider = new ethers.JsonRpcProvider(' https://mainnet.era.zksync.io ')
const privateKey = [/**private key array */]
const Wallet = privateKey.map(p => new ethers.Wallet(p,provider))

async function main() {
    for (let index = 0; index < Wallet.length; index++) {
        await claim(Wallet[index])
        await sleep(1000)
    }
}
main()

async function claim(wallet) {
    try {
        const [amount] = await fetch(`https://www.zksyncpepe.com/resources/amounts/${wallet.toLowerCase()}.json`, {
            method: 'GET'
        })
        .then(async(response) => {
            return response.json()
        }).catch(error => {
            console.error('地址不符合：',Wallet[0])
            return 'f';
        })
        if (amount !== 'f') {
            // console.log(amount)
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
            const result = await wallet.sendTransaction(tx)
            await result.wait()
            console.log(`${wallet.address} 完成领取，数量${amount}`)
        }else {
            console.log(`${wallet.address} 该地址不满足要求`)
        }
    } catch (error) {
        console.log(error.message)
    }
}

function sleep(ms) {
    return new Promise((res) => setTimeout(res,ms));
}

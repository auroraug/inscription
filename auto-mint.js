// Pols (Prc-20)
const {ethers} = require('ethers')
const fetch = require('node-fetch')
const { re } = require('./encrypto')
// Your Alchemy api
const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/_Your_Alchemy_API')
// Your Private Key
const wallet = new ethers.Wallet(Private_Key,provider)
const data = {
    "query": "query GetBrc20Tokens($limit: Int = 1, $offset: Int = 0, $order_by: [brc20_tokens_order_by!] = {}, $where: brc20_tokens_bool_exp = {}) {\n  brc20_tokens(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {\n    decimal_digits\n    decimals\n    max_supply\n    mint_limit\n    minted_total\n    protocol\n    network_id\n    created_at\n    stats {\n      holders\n    }\n    tick\n  }\n}",
    "variables": {
        "limit": 25,
        "offset": 0,
        "where": {
            "max_supply": {
                "_neq": "0"
            },
            "network_id": {
                "_eq": "eip155:137"
            },
            "_or": [
                {
                    "tick": {
                        "_eq": "pols"
                    }
                },
                {
                    "protocol": {
                        "_eq": "pols"
                    }
                }
            ]
        },
        "order_by": [
            {
                "created_at": "asc"
            }
        ]
    },
    "operationName": "GetBrc20Tokens"
}
async function main() {
    while(true) {
        let minted_amount;
        let flag = true;
        try {
            const url = 'https://api.evm.ink/v1/graphql/';
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then(response => response.json())
          .then(result => {
            const data = result.data
            const mintedAmount = data.brc20_tokens[0].minted_total;
            minted_amount = parseFloat(mintedAmount/1e26)
            console.log(minted_amount)
          }).catch(error => {
            console.error('Error:', error);
          });
        const feedata = await provider.getFeeData();
        if (parseFloat(parseInt(feedata.gasPrice)/1e9) <= 2000.0 && minted_amount <= 21000000.0){
            flag = true;
        }
        } catch (error) {
            console.log(error.message)
        }
        
        if (flag) {
            try {
                const nonce = await wallet.getNonce()
                const feedata = await provider.getFeeData();
                const tx = {
                    nonce: nonce,
                    gasPrice: feedata.gasPrice+BigInt(3e11),
                    to: wallet.address,
                    data: '0x646174613a2c7b2270223a226273632d3230222c226f70223a226d696e74222c227469636b223a22626e6269222c22616d74223a2235303030227d',
                }
                const transaction = await wallet.sendTransaction(tx)
                await transaction.wait()
                console.log(transaction.hash)
            } catch (error) {
                console.log(error.message)
            }
        }else console.log('GasPrice currently too high or minted amount reached 21000000!')
    }
}

main()

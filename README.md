# sologenic-nft-conversion-verifier
NPM package to verify conversion of NFT from xls14d standard to xls20d

## How to use sologenic-nft-conversion-verifier

### Install the package to your local project

`npm i sologenic-nft-conversion-verifier`

### Download the public key from sologenic

### Use the library to verify the conversion

```const { verifyConversion } = require('sologenic-nft-conversion-verifier');

const main = async () => {
    var res = await verifyConversion('00080000F64EFF6B5C1CD8BCD60B1A8736DE722E6BF2CF1516E55FA300000001', './pubkey.pem','wss://s.devnet.rippletest.net:51233');
    console.log(res);
}

main()```

# sologenic-nft-conversion-verifier
NPM package to verify conversion of NFT from xls14d standard to xls20d

## How to use sologenic-nft-conversion-verifier

### Install the package to your local project

`npm i sologenic-nft-conversion-verifier`

### Download the public key from sologenic

### Use the library to verify the conversion

```const { verifyConversion } = require('sologenic-nft-conversion-verifier');

const main = async () => {
    var res = await verifyConversion('9B792FDD5D9F351EFE63C46128CE1DF346B362C9F8729EA940433A43E379DA6D', './pubkey.pem');
    console.log(res);
}

main()```

# sologenic-nft-conversion-verifier
NPM package to verify conversion of NFT from xls14d standard to xls20d.
You can use this package or perform the verification manually using this (guide)[https://medium.com/@sologenic/sologenic-xls20-verification-743ffb8e1cb8]

## How to use sologenic-nft-conversion-verifier

### Install the package to your local project

`npm i sologenic-nft-conversion-verifier`

### Download the public key from sologenic

Public key is available (here)[https://sologenic.org/conversion-verification]

Copy it and save into a file `pubkey.pem`

### Use the library to verify the conversion

Import the library in your project
```const { verifyConversion } = require('sologenic-nft-conversion-verifier');```

Call the function to do the verification

```
verifyConversion(*tokenID*, *path_to_public_key_file*,*xrpl_node_url*);
```

This function takes as parameters:
- tokenID - id of NFT found on ledger
- path_to_public_key_file - path to the file that was saved in previous step
- xrpl_node_url - url to xrpl node ("wss://xrpl.ws" for mainnet)

Example:
```const { verifyConversion } = require('sologenic-nft-conversion-verifier');

const main = async () => {
    var res = await verifyConversion('00080000F64EFF6B5C1CD8BCD60B1A8736DE722E6BF2CF1516E55FA300000001', './pubkey.pem','wss://s.devnet.rippletest.net:51233');  // ! the node url here is devnet !
    console.log(res);
}

main()```

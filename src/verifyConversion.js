"use strict";
const xrpl = require("xrpl");
const jwt = require("jsonwebtoken");
const fs = require('fs');

// "wss://xrpl.ws"

module.exports = async (mintTxId, keyPath) => {
    const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
    await client.connect();
    // fetch mint transaction for token
    const tx_info = await client.request({
        "command": "tx",
        "transaction": mintTxId,
        "binary": false
    });

    if( tx_info.result.TransactionType != 'NFTokenMint'){
      return false;
    }


    // parse tokenID from tx
    const tokenIdFromTx = tx_info.result.meta.AffectedNodes[0].ModifiedNode.FinalFields.MintedNFTokens > 1 ?
      tx_info.result.meta.AffectedNodes.pop().ModifiedNode.FinalFields.NFTokens.pop().NFToken.NFTokenID
      : tx_info.result.meta.AffectedNodes.pop().CreatedNode.NewFields.NFTokens.pop().NFToken.NFTokenID;

    // parse memos
    const jwtFromMemo = Buffer.from(tx_info.result.Memos[0].Memo.MemoData, "hex").toString("utf8");

    var cert = fs.readFileSync(keyPath);

    const result = jwt.verify(jwtFromMemo, cert, { algorithms: ['ES256'] }, function(err, decoded) {
        // verify jwt signature with sologenic public key
        if (err) {
          return false;
        }

        // compare tokenID from tx to tokenID in memos
        if(decoded.token_id === tokenIdFromTx) {
          return true;
        } else {
          return false;
        }
    });
    return result;
}






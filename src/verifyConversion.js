"use strict";
const xrpl = require("xrpl");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { encodeAccountID } = require('ripple-address-codec');
const BigNumber = require('bignumber.js');

function unscrambleTaxon(taxon, tokenSeq){
  return (taxon ^ (384160001 * tokenSeq + 2459)) % 4294967296
}

module.exports = async (tokenId, keyPath, xrplNode) => {
    let result = false;
    // const client = new xrpl.Client(xrplNode);
    // await client.connect();

    const scrambledTaxon = new BigNumber(tokenId.substring(48, 56), 16).toNumber();
    const sequence = new BigNumber(tokenId.substring(56, 64), 16).toNumber();
    const issuer = encodeAccountID(Buffer.from(tokenId.substring(8, 48), 'hex'));
    const tokenTaxon = unscrambleTaxon(scrambledTaxon, sequence);

    // fetch mint transaction for token
    const transactions = await getAccountTransactions(
      xrplNode,
      issuer,
      []
    );

    transactions.forEach(transaction => {
      if(transaction.tx?.TransactionType === "NFTokenMint" && transaction.tx?.NFTokenTaxon === tokenTaxon ){
        // parse memos
        const jwtFromMemo = Buffer.from(transaction.tx?.Memos[0].Memo.MemoData, "hex").toString("utf8");

        var cert = fs.readFileSync(keyPath);

        result = jwt.verify(jwtFromMemo, cert, { algorithms: ['ES256'] }, function(err, decoded) {
            // verify jwt signature with sologenic public key
            if (err) {
              return false;
            }

            if(decoded.token_id != tokenId){
              return false;
            }
            return true;
        });
      }
    });
    return result;
}


async function getAccountTransactions(xrplNode, address, transactions, marker){
  try {
    const client = new xrpl.Client(xrplNode);
    await client.connect();

    const request = {
      command: "account_tx",
      // ledger_index_min: -1,
      // ledger_index_max: -1,
      limit: 100,
      account: address,
      ...(marker && { marker })
    };

    let tx = await client.request(request);
    if (def(tx.result)) {
      for (var i = 0; i < tx.result.transactions.length; i++) {
        transactions.push(tx.result.transactions[i]);
      }

      if (def(tx.result.marker)) {
        console.log(tx.result.marker)
        return getAccountTransactions(xrplNode, address, transactions, tx.result.marker);
      } else {
        return transactions;
      }
    }

    return [];
  } catch (e) {
    console.log(e);
    return false;
  }
};

function def(val) {
  if (typeof val === "undefined") {
    return false;
  }
  return true;
};

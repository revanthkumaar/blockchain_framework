const sha256 = require('sha256')

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock(0,'0','0'); //genesis block
}


Blockchain.prototype.createNewBlock = function(nonce,hash,previousBlockHash){
    const newBlock = {
        index:this.chain.length+1,
        timestamp: Date.now(),
        transactions:this.pendingTransactions,
        nonce:nonce,
        hash:hash,
        previousBlockHash:previousBlockHash
    }
    this.pendingTransactions = [];
    this.chain.push(newBlock)
    return newBlock;
}


Blockchain.prototype.createNewTransaction = function(sender,recipient,amount){
    const newTransaction = {
        sender:sender,
        recipient:recipient,
        amount:amount
    }
    this.pendingTransactions.push(newTransaction);
    return newTransaction;
}


Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockData,nonce){
    
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    console.log(dataAsString);
    const hash = sha256(dataAsString)
    return hash;
}




module.exports = Blockchain; //permission







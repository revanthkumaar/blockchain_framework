function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
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






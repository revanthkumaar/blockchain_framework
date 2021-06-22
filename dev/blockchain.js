const sha256 = require('sha256')
const currentNodeUrl = process.argv[3];

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.currentNodeurl = currentNodeUrl;
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

Blockchain.prototype.getLastBlock = function(){
   return this.chain[this.chain.length-1]
}


Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockData,nonce){
    
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
   
    const hash = sha256(dataAsString)
    return hash;
}

Blockchain.prototype.proofOfWork = function(currentBlockData,previousBlockHash){

    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);

    while(hash.substring(0,5) !== '00000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
        
        
    }
    return nonce;
}



Blockchain.prototype.chainIsValid = function(blockchain){
    //verify whether the longest chain is valid or not
    let validChain = true;
    //conditions to verify and return false if the chain fails any checks
    for(var i=1; i<blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];
        const blockHash = this.hashBlock(prevBlock['hash'],
         {transactions: currentBlock['transactions']}, 
         currentBlock['nonce']);
        if(blockHash.substring(0,5) !== '00000'){
            validChain = false;
        }
        if (currentBlock['previousBlockHash'] 
        !== prevBlock['hash']) 
        {
            validChain = false;
        }  
    }
    //verify the genesis 
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 0;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        validChain = false;
    }
   return validChain;
}

Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


module.exports = Blockchain; //permission







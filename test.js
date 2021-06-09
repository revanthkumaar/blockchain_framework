const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();

var previousBlockHash = 'd23eadsf423rfasfdasd'

var currentBlockData = {
    "sender":"ram",
    "recipient":"kumar",
    "amount":4213432
}

const nonce = bitcoin.proofOfWork(currentBlockData,previousBlockHash);
console.log(nonce);






/*creating an instance of the file
bitcoin.createNewBlock(123,'sadasdasda23edasd23das','asd23dasdc234rasd23dqd')
bitcoin.createNewBlock(654764,'986986986','9869869')
bitcoin.createNewBlock(123,'sadasdasda23edasd23das','asd23dasdc234rasd23dqd')
bitcoin.createNewTransaction('ram','revanth',5000)

var previousBlockHash = 'd23eadsf423rfasfdasd'
var nonce = 31212
var currentBlockData = {
    "sender":"ram",
    "recipient":"kumar",
    "amount":4213432
}

const hash = bitcoin.hashBlock(previousBlockHash,nonce,currentBlockData)


console.log(hash)

console.log('-----------------')

console.log(bitcoin)

*/
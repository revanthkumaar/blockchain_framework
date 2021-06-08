const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();
//creating an instance of the file

const newBlock = bitcoin.createNewBlock(123,'sadasdasda23edasd23das','asd23dasdc234rasd23dqd')

console.log(newBlock)
const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();
//creating an instance of the file
bitcoin.createNewBlock(123,'sadasdasda23edasd23das','asd23dasdc234rasd23dqd')
bitcoin.createNewBlock(654764,'986986986','9869869')
bitcoin.createNewBlock(123,'sadasdasda23edasd23das','asd23dasdc234rasd23dqd')



console.log(bitcoin)
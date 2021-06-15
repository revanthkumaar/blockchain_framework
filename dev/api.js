const express = require('express')
const bitcoinApp = express()
const port = process.argv[2]
const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();

const bodyParser = require('body-parser');

bitcoinApp.use(bodyParser.json());
bitcoinApp.use(bodyParser.urlencoded({ extended: false }));
 
bitcoinApp.get('/', function (req, res) {
  res.send(bitcoin)
})

 
bitcoinApp.post('/transaction',function(req,res){
  console.log('this is from api.js, i received the info : ')
  console.log(req.body)
  const newTransaction = req.body;
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var amount = req.body.amount;
  bitcoin.createNewTransaction(sender,recipient,amount);
  res.json({note: `transaction is received and be processed soon`})
})

//one to one node registry call
bitcoinApp.post('/register-node',function(req,res){
  const newNodeUrl = req.body.newNodeUrl;
  const nodeAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if(nodeAlreadyPresent && notCurrentNode){
    bitcoin.networkNodes.push(newNodeUrl)
  }
  console.log('the blockchain constructor is:')
  console.log(bitcoin)
  res.json({ note: 'New node registered successfully.' });
})

//bulk node address registry
bitcoinApp.post('/register-nodes-bulk',function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
      const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) 
    {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
    });
    res.json({ note: 'Bulk registration successful.' });
})

bitcoinApp.listen(port,function(){
  console.log(`the node is active on port number : ${port}`)
})
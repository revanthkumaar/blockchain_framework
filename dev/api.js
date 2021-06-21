const express = require('express')
const bitcoinApp = express()
const port = process.argv[2]
const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();

const rp = require('request-promise');

const bodyParser = require('body-parser');

bitcoinApp.use(bodyParser.json());
bitcoinApp.use(bodyParser.urlencoded({ extended: false }));
 
bitcoinApp.get('/blockchain', function (req, res) {
  res.send(bitcoin)
})

//for single node communication
 
bitcoinApp.post('/transaction',function(req,res){
  const newTransaction = req.body;
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var amount = req.body.amount;
  bitcoin.createNewTransaction(sender,recipient,amount);
  res.json({note: `transaction is received and be processed soon`})
})

//transaction broadcast functionality
bitcoinApp.post('/transaction/broadcast',function(req,res){
  //update pending transactions at current node
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  //broadcast the same transaction to all other nodes
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl+'/transaction',
      method: 'POST',
      body: newTransaction,
      json:true
    };
    requestPromises.push(rp(requestOptions));
    Promise.all(requestPromises)
    .then(data => {
      res.json({note:'transaction broadcasted to other nodes, it will be confirmed in a while'})
    })

  })
})

//mining API

bitcoinApp.get('/mine',function(req,res){
  //TO CREATE AND INSERT THE BLOCK AT CURRENT NODE : 3004
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = bitcoin.pendingTransactions;
  const nonce = bitcoin.proofOfWork(currentBlockData,previousBlockHash);
  const hash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);
  const newBlock = bitcoin.createNewBlock(nonce,hash,previousBlockHash);
  //BROADCAST THE BLOCK 
  
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl+'/receive-new-block',
      method: 'POST',
      body: newBlock,
      json:true
    };
    requestPromises.push(rp(requestOptions));
    Promise.all(requestPromises)
    .then(data => {
     //generate the reward
    const requestOptions =  {    uri:bitcoin.currentNodeUrl+'/transaction/broadcast',
      method:'POST',
      body:{ 
        sender:'00',
        recipient:bitccoin.currentNodeUrl,
        amount:6.5
     },
     json:true};

     return rp(requestOptions);

      
    })
    .then(data => {
      res.json({note: "New block is mined and broadcasted succcessfully"})
    })

  })

});

bitcoinApp.post('/receive-new-block',function(req,res){
  //receive the block info sent from the miner 
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock['hash'] === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
//verifies if the block parameters match or not
  if(correctHash && correctIndex){
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions= [];
    res.json({
      note: 'new block received and added'
    })
  }
  else{
    res.json({
      note:'new block is not added'
    })
  }
})

//network sync call
// register a node and broadcast it the network
bitcoinApp.post('/register-and-broadcast-node', function(req, res) {
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];

  //NODE ADDRESS BROADCAST
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
      //BULK REGISTER 
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});


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

//CONSENSUS: 
bitcoinApp.get('/consensus',function(req,res){
  //GET ALL THE CHAINS IN THE NETWORK
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
        uri: networkNodeUrl + '/blockchain', 
        method:'GET',
        json:true
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises) //async calling in javascript
  .then(blockchains => {
    //once you get all the chains from every node in the network
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength; //3003
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      if(blockchain.chain.length > maxChainLength){
        maxchainLength = blockchain.chain.length;
          //FIND OUT THE LONGEST CHAIN NAME
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    })
    //VERIFY THE LONGEST CHAIN'S VALIDITY

    if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
        //you no need to replace the chain
        res.json({
          note: 'Current chain has not been replaced.',
          chain: bitcoin.chain
        });
    }
    else{

      //you need to replace the chain
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			});

    }

  });






  //REPLACE THE SHORTER CHAINS WITH LONGEST ONE
});

bitcoinApp.listen(port,function(){
  console.log(`the node is active on port number : ${port}`)
})
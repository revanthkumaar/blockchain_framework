const express = require('express')
const bitcoinApp = express()

const Blockchain = require('./blockchain'); 
//importing a functionality written inside a file called 'blockchain.js'
const bitcoin = new Blockchain();

const bodyParser = require('body-parser');

bitcoinApp.use(bodyParser.json());
bitcoinApp.use(bodyParser.urlencoded({ extended: false }));
 
bitcoinApp.get('/', function (req, res) {
  res.send('now you are at a node')
})

bitcoinApp.get('/home',function(req,res){
    res.send('this is the home page of my node')
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

bitcoinApp.listen(3000)
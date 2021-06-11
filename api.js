const express = require('express')
const bitcoinApp = express()

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
  const newTransaction = req.body;
  console.log(newTransaction)
  res.json({note: `transaction is received and be processed soon`})
})

bitcoinApp.listen(3000)
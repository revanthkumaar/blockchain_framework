const express = require('express')
const bitcoinApp = express()
 
bitcoinApp.get('/', function (req, res) {
  res.send('now you are at a node')
})

bitcoinApp.get('/home',function(req,res){
    res.send('this is the home page of my node')
})
 
bitcoinApp.listen(3000)
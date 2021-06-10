const express = require('express')
const bitcoinApp = express()
 
bitcoinApp.get('/', function (req, res) {
  res.send('now you are at a node')
})
 
bitcoinApp.listen(3000)
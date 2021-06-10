const express = require('express')

const bitcoinApp = express()

 bitcoinApp.get('/home',function(res,req){
    res.send('home of bitcoin')
 })

 bitcoinApp.listen(3000)

const express = require('express')
const route = express.Router()
const jwt = require('jsonwebtoken');
const user = require('../controller/user')
const users = require('../models/user')


const authentication = (req,res,next)=>{
    const token = req.header('Authorization');
    if (token){
        const userId = jwt.verify(token,process.env.TOKEN_SECRET);
        req.id = userId.id
        console.log('This is userId', userId.id)
        next()
    }
    else{
        res.status(400).json({message:"Authenication failed"})
    }
}

route.post('/sign-up', user.detail)
route.post('/sign-in',user.sign_in)
route.get('/get-contact',authentication,user.getContact)

route.post('/get/allmessages',authentication,user.allMessage)
route.post('/send/messages',authentication,user.sendMessage)
route.post('/get/message',user.message)

module.exports = route
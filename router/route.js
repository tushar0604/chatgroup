const express = require('express')
const route = express.Router()
const user = require('../controller/user')
const users = require('../models/user')

const initialize = async(req,res,next)=> {
    const sender = req.body.sender
    await users.findOne({where:{id:sender}})
    .then(sender => req.sender = sender)
    next()
}

route.post('/sign-up', user.detail)
route.post('/sign-in',user.sign_in)

route.post('/get/allmessages',user.allMessage)
route.post('/send/messages',initialize,user.sendMessage)

module.exports = route
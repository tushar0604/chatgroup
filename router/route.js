const express = require('express')
const route = express.Router()
const user = require('../controller/user')

route.post('/sign-up', user.detail)
route.post('/sign-in',user.sign_in)

module.exports = route
const express = require('express')
const bodyParser = require('body-parser')
const user = require('./router/route')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./util/database')
// var cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public','static')));

app.use('/home',user)
app.use((req,res) => {
    let url = req.url
    if (url){
        res.sendFile(path.join(__dirname,
        `public${url}`))
    }
})
// app.use(cors());

sequelize.sync()
    .then(
        app.listen(3000)
    )
    .catch(err => console.log(err))

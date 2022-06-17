const express = require('express')
const bodyParser = require('body-parser')
const user = require('./router/route')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./util/database')
const users = require('./models/user')
const messages = require('./models/message')
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

users.hasMany(messages, {
    foreignKey: 'senderId',
    as: 'OutgoingMessages'
});
users.hasMany(messages, {
    foreignKey: 'receiverId',
    as: 'IncomingMessages'
});
messages.belongsTo(users, {
    foreignKey: "senderId",
    as: 'Sender'
});
messages.belongsTo(users, {
    foreignKey: "receiverId",
    as: 'Receiver'
});


sequelize
    .sync()
    // .sync({alter:true})
    .then(
        app.listen(3000)
    )
    .catch(err => console.log(err))

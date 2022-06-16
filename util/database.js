const Sequelize = require('sequelize')

console.log('This is the password',process.env.DB_PASSWORD)

const sequelize = new Sequelize('group-chat','root',
    'Sakshi@1995',{
    host: 'localhost',
    dialect:'mysql'
})

module.exports = sequelize
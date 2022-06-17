const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const message = sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = message
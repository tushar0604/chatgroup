const users = require('../models/user')
const message = require('../models/message')
const bcrypt = require('bcryptjs')
const path = require('path')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config()

function generateAccessToken(id) {
    return jwt.sign(id, process.env.TOKEN_SECRET);
}

exports.detail = (req,res,next)=>{
    console.log('This is the body', req.body.email)
    users.findOne({
        where:{
            email:req.body.email
        }
    })
    .then(user => {
        if(user===null){
            bcrypt.hash(req.body.password,12)
            .then(hash_pass => {
                users.create({
                    name:req.body.name,
                    email:req.body.email,
                    phone_no:req.body.phone,
                    password:hash_pass
                })
                res.status(200).json({success:true})
            })
            .catch(err=>{
                res.status(400).json({message:err})
            })
        }else{
            res.status(400).json({message:'The E-mail user Already exist'})
        }
    })
    .catch(err => res.status(400).json({message:err}))
}

exports.sign_in = (req,res,next)=>{
    users.findOne({
        where:{
            email:req.body.email
        }
    })
    .then(user => {
        if (!user){
            return res.status(400).json({status:"The Email address doesn't exist."})
        }else {
            bcrypt.compare(req.body.password,user.password)
            .then(result =>{
                if (result){
                    const token = generateAccessToken({id:user.id});
                    res.status(200).json({token:token,redirect:'/main/home'});
                } else{
                    res.status(400).json({status:'Incorrect Password'})
                }
            })
        }
    })
    .catch(err => res.status(400).json({message:err}))
}

exports.getContact = async(req,res,next) =>{
    let user_list = []
    await users.findAll({
        where:{
            id:{
                [Sequelize.Op.not]:req.id
            }
        }
    })
    .then(users => {
        let user
        users.forEach((individual) => {
            user = {
                id:individual.id,
                name:individual.name
            }
            user_list.push(user)
        });
        res.status(200).json(user_list)
    })
}

exports.allMessage = async(req,res,next) =>{
    await message.findAll({
        where: Sequelize.or(
            {senderId:req.body.sender,receiverId:req.id},
            {senderId:req.id,receiverId:req.body.sender}
        )
    })
    .then(response => {
        res.status(200).json({
            sender:req.body.sender,
            receiver:req.id,
            response
        })
    })
}

exports.sendMessage = async(req,res,next) =>{
    users.findOne({
        where:{
            id:req.id
        }
    })
    .then(async user =>{
        await user.createOutgoingMessage({
            message:req.body.message,
            receiverId: req.body.receiver
        })
        .then(response => {
            res.json(response)
        })
    })
}

exports.message = async(req,res) =>{
    users.findOne({
        where:{
            id:req.body.id
        }
    })
    .then(async user =>{
        await user.getOutgoingMessages()
        .then(response => {
            res.json(response)
        })
    })
}

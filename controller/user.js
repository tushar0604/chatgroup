const users = require('../models/user')
const message = require('../models/message')
const bcrypt = require('bcryptjs')
const path = require('path')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config()

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000s' });
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
                    const token = generateAccessToken({username:user.id});
                    res.status(200).json({token:token,redirect:'/main/home'});
                } else{
                    res.status(400).json({status:'Incorrect Password'})
                }
            })
        }
    })
    .catch(err => res.status(400).json({message:err}))
}

exports.allMessage = async(req,res,next) =>{
    await message.findAll({
        where: Sequelize.or(
            {senderId:req.body.sender,receiverId:req.body.receiver},
            {senderId:req.body.receiver,receiverId:req.body.sender}
        )
    })
    .then(response => {
        console.log(response)
        res.json(response)
    })
}

exports.sendMessage = async(req,res,next) =>{
    await req.sender.createOutgoingMessage({
        message:req.body.message,
        receiverId: req.body.receiver
    })
    .then(response => {
        res.json(response)
    })
}

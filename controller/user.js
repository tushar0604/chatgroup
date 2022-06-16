const users = require('../models/user')
const bcrypt = require('bcryptjs')
const path = require('path')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
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

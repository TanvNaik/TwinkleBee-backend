const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = (req,res) => {

    const errors = validationResult(req);

    // checking for validation errors
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.errors
        })//422- Unprocessable entity
    }

    // if(!req.files.document){
    //     return res.status(422).json({
    //         error:[{
    //             param: "document",
    //             msg: "Document is not Uploaded"
    //         }] 
    //     })
    // }
    
    if(req.body.cfPassword !== req.body.password){
        return res.status(422).json({
            error: [{
                param: "cfPassword",
                msg: "Password and confirm password must match"
            }] 
        })
    }

    const user = new User(req.body);
    if(req.files.pp){
        user.profile_pic = req.files.pp[0].filename;
    }
    else{
        user.profile_pic = user.gender == "Female" ? "default_female_pp.png":"default_male_pp.png"
    }
   
    user.save((err, user) => {
        if(err){
            console.log(err)
            if(err.keyValue.email){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg: "An account with this email already exists"
                    }] 
                })
            }else if(err.keyValue.username){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg: "Username is already taken"
                    }] 
                })
            }else{
                return res.status(400).json({
                    error:[{
                        param: "general",
                        msg:"Signup failed"
                    }]  
                })
            }
        }
        return res.json({
            name: user.name,
            email: user.email,
            id: user._id,
        })
    })

}

exports.signin = (req,res) => {
    const { username, password } = req.body;
    console.log(req.body)
    User.findOne(
        {$or:[
            {email: username},
            {username: username}
        ]}
            ,((err, user)=>{

        // checking if user with given email exists
        if(err || !user){
            return res.status(400).json({
                error: [{
                    param: "general",
                    msg: "Bad credentials"
                }] 
            })
        }

        // checking password
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and Password does not match"
            })
        }
        // creating token
        const token = jwt.sign({_id: user._id},process.env.SECRET)
        res.cookie("token", token, {expire: new Date() + 5});
        // sending response to frontend

        user.encry_password = ""
        user.salt = ""
        return res.json({user,token})
    }))

}

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "User signout successful"
    })
}

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'] ,
    userProperty: "auth"
})


// Custom Middlewares

exports.isAuthenticated = (req,res,next) =>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
          error: "ACCESS DENIED"
        });
      }
    next();
}


exports.isAdmin = (req,res,next) =>{
    if(req.profile.role !==0){
        return res.status(403).json({
            error: "You are not an ADMIN, Access Denied"
        })
    }
    next();
}
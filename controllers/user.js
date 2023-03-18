const User = require("../models/user")
const Feedback = require("../models/feedback")
const Invoice = require("../models/invoice")
const Baby = require("../models/baby")
const Booking = require("../models/booking")

const { validationResult } = require('express-validator');
const crypto = require("crypto");




exports.getUserById = (req,res, next, id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }
        req.profile = user;
        next();
    })
}
exports.getUser = (req,res)=>{

    User.findById(req.params.findUser).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }
        req.user = user;
          //hiding secured info
    req.user.salt = undefined;
    req.user.encry_password = undefined;
    req.user.createdAt = undefined;
    req.user.updatedAt = undefined;
    
    return res.json({
        user: req.user
    });  
    })  
}


exports.addBaby = (req,res)=>{

    const errors = validationResult(req);
    console.log(errors.errors)
    // checking for validation errors
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.errors,
        })//422- Unprocessable entity
    }
    
    
    const baby = new Baby(req.body);
    baby.parentId = req.profile._id;
    

    baby.save((error, vehicle)=>{
        if(error){
            return res.status(400).json({
                error: [{
                    param: "general",
                    msg:"Unable to save baby details"
                }]
            })
        }
        req.baby = baby;

        User.findByIdAndUpdate(req.profile._id,{
            $push: {
                "baby": baby._id
            }
        },
        {new: true, useFindAndModify: false },
        (error, user)=>{
            if(error){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg:"Unable to add baby details in user profile"
                    }]
                })
            }
            return res.json({
                message: "Baby's details added successfully"
            })  
        })
    })
}

exports.checkUsernameAndEmail = (req,res) => {

    User.find({'username': req.body.username, 'email': req.body.email})
    .exec((err, user) => {
        if(err || user.length == 0){
            return res.status(400).json({
                error: "There is no user with this email and username"
            })
        }
        return res.json({
            _id: user[0]._id
        })
    })


}

exports.getUserBabies = (req, res) => {

    Baby.find({parentId: req.profile._id})
    .exec((err, babies) => {
        if(err || vehicles.length == 0){
            return res.status(400).json({
                error: "No Babies found"
            })
        }
        return res.json({
            babies: babies
        })
    })

}

exports.verifyBabySitter = (req,res) =>{
    const userId = req.body.userId;
    
    User.findByIdAndUpdate(userId, {verificationStatus: true}, {new: true}, (err, user) =>{
        if(err){
            return res.status(400).json({
                error: "Unable to verify the user"
            })
        }
        else{
            return res.status(200).json({
                message: "User Verified Succesfully"
            })
        }
    })  
}

exports.getUserBookings = (req,res)=>{
    Booking.find({"parentId": req.profile._id})
    .populate('invoiceId babyId parentId').exec((err, bookings)=>{
        if(err || !bookings){
            return res.json({
                error: "No Rides Found"
            })
        }
        return res.json({
            bookings: bookings
        });
    })
}

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(req.profile._id,
        {$set: req.body},
        {new: true, useFindAndModify: false },
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to update the user"
                })
            }
            user.salt = undefined,
            user.encry_password = undefined

            return res.json(user)
        })
}
exports.changePassword = (req,res) => {
    const encry_password = crypto
        .createHmac("sha256",req.profile.salt
        )
        .update(req.body.password)
        .digest("hex");
    User.findByIdAndUpdate(req.body._id,
        {'encry_password': encry_password},
        {new: true, useFindAndModify: false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to update password"
                })
            }
            return res.json({
                message: "Password Updated Successfully."
            })
        })
}
exports.getUserPayments = (req,res)=>{

    Invoice.find({
        "_id": {
            $in: req.profile.payments
        }
    }).populate("receiver").exec((error,payments)=>{
        if(error){
            return res.status(400).json({
                error: "Cannot find Payments"
            })
        }
        return res.json({
            payments: payments
        })
    })
}
exports.showPendingVerifications = (req,res) =>{

    User.find( {$and: [
        {verificationStatus: false},
        {role: 3}
    ]}).exec((err, users) => {
        if (err) {
          return res.status(400).json({
            error: "NO Users found"
          });
        }
        res.json({
            users: users
        });
      });

}
// FEEDBACKS
exports.getUserFeedBacks = (req,res)=>{
    
    Feedback.find({
        "_id": {
            $in: req.profile.feedbacks
        }
    }).populate("feedbacker").exec((error,feedbacks)=>{
        if(error){
            return res.status(400).json({
                error: "Cannot find Feedbacks"
            })
        }
        return res.json({
            feedbacks: feedbacks
        })
    })
}

exports.writeFeedback = (req,res)=>{
    
    const feedback = new Feedback({
        feedbacker: req.params.feedbacker,
        receiver: req.params.feedbackReceiver,
        feedbackText: req.body.feedbackText,
        rating: req.body.rating
    })

    feedback.save((err,feedback)=>{
        if(err){
            return res.status(400).json({
                error: `Unable to save`,
            })
        }
        User.findByIdAndUpdate(feedback.receiver, 
            {"$push" : { "feedbacks": feedback._id}},
            {new: true, useFindAndModify: false },
            (err, user)=>{
                if(err){
                    return res.status(400).json({
                        error: "Unable to update feedback to receiver"
                    })
                }
                }
            )
        return res.json({
            feedbacker: feedback.feedbacker,
            receiver: feedback.receiver,
            feedbackText: feedback.feedbackText,
            rating: feedback.rating
        })
    })
}

exports.updatePaymentInUser = (req,res) => {
    User.findByIdAndUpdate(req.body.sender, 
        {"$push" : { "payments": res.locals.invoice._id}},
        {new: true, useFindAndModify: false },
        (err, user)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to update payment to sender"
                })
            }
            return res.json({
                        invoice: res.locals.invoice,
                        ride: res.locals.ride
                    })
            
        }
        )
}

const User = require("../models/user")
const Feedback = require("../models/feedback")
const Invoice = require("../models/invoice")
const Baby = require("../models/baby")
const Booking = require("../models/bookings")
const { validationResult } = require('express-validator');


const Doctor = require("../models/doctor")




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

exports.getBabyById = (req,res,next,id) => {
    
    Baby.findById(id)
    
    .exec((err,baby)=>{
        if(err || !baby){
            return res.status(400).json({
                error: "No baby was found in DB"
            });
        }
        req.baby = baby;
        next();
    })
}

exports.getBaby = (req,res) => {
    Baby.findById(req.params.findBaby)
    .populate('parent babysitter doctors')
    .exec((err,baby)=>{
        if(err || !baby){
            return res.status(400).json({
                error: "No baby was found in DB"
            });
        }
        req.baby = baby
        return res.json({
            baby: req.baby
        });    
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
    baby.parent = req.profile._id;
    if(req.files.pp){
        baby.profile_pic = req.files.pp[0].filename;
    }
    else{
        baby.profile_pic = baby.gender == "Female" ? "default-female-baby.svg":"default-male-baby.svg"
    }

    baby.save((error, baby)=>{
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
                babyId: baby._id,
                message: "Baby's details added successfully"
            })  
        })
    })
}
exports.addVaccination = (req,res) => {
    console.log(req)
    Baby.findByIdAndUpdate(req.baby._id,{
        $push: {
            "vaccination": req.body
        }
    },
    {new: true, useFindAndModify: false },
    (error, baby)=>{
        if(error){
            return res.status(400).json({
                error: [{
                    param: "general",
                    msg:"Unable to add Vaccine details"
                }]
            })
        }
        return res.json({
            message: "Vaccine details added successfully"
        })  
    })

}

exports.addDoctor= (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.errors,
        })//422- Unprocessable entity
    }
    
    
    const doctor = new Doctor(req.body);
    
    
    doctor.save((error, doctor)=>{
        if(error){
            return res.status(400).json({
                error: [{
                    param: "general",
                    msg:"Unable to save doctor details"
                }]
            })
        }
        req.doctor = doctor;
        console.log(req.doctor.contact)

        Baby.findByIdAndUpdate(req.baby._id,{
            $push: {
                "doctors": doctor._id
            }
        },
        {new: true, useFindAndModify: false },
        (error, baby)=>{
            if(error){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg:"Unable to add doctor details in baby's profile"
                    }]
                })
            }

            return res.json({
                doctor: doctor._id,
                message: "Doctor's details added successfully"
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
        if(err || babies.length == 0){
            return res.status(400).json({
                error: "No Babies found"
            })
        }
        return res.json({
            babies: babies
        })
    })

}
// BABYSITTERS
exports.getAllBabysitters = (req,res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
    User.find()
    .where('role')
    .equals('1')
    .sort([[sortBy, 'descending']])
    .exec((err, babysitters) => {
        if(err){
            return res.status(400).json({
                error: "No babysitters found"
            })
        }
        return res.json({
            babysitters: babysitters
        })
    })
}

exports.assignBabysitter = (req,res) =>{
    const userId = req.params.babysitterId;
    const bookingId = req.params.bookingId;
    Booking.findByIdAndUpdate(bookingId, {babysitter: userId, babysitterAssigned: true}, {new: true}, (err, user) =>{
        if(err){
            return res.status(400).json({
                error: "Unable to assign the Babysitter"
            })
        }
        else{
            return res.status(200).json({
                message: "Babysitter assigned Succesfully"
            })
        }
    })  
}

exports.verifyBabySitter = (req,res) =>{
    const userId = req.params.babysitterId;
    
    User.findByIdAndUpdate(userId, {verificationStatus: true}, {new: true}, (err, user) =>{
        if(err){
            return res.status(400).json({
                error: "Unable to verify the Babysitter"
            })
        }
        else{
            return res.status(200).json({
                message: "Babysitter Verified Succesfully"
            })
        }
    })  
}
exports.deleteBabysitter = (req, res) => {
    const userId = req.params.babysitterId;
    User.deleteOne({_id:userId})
  .then(result=>{
    return res.json({
        message: "Babysitter Deleted Successfully"
    })
    })   
}



exports.getUserBookings = (req,res)=>{
    Booking.find({"parentId": req.profile._id})
    .populate('invoiceId babyId parentId babysitter').exec((err, bookings)=>{
        if(err || !bookings){
            return res.json({
                error: "No bookings Found"
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
    User.findByIdAndUpdate(req.body.parent, 
        {"$push" : { "payments": res.locals.invoice._id}},
        {new: true, useFindAndModify: false },
        (err, user)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to update payment in Parent's profile"
                })
            }
            return res.json({
                        invoice: res.locals.invoice,
                        
                    })
            
        }
        )
}

// getBookingById
// getAllBookings
// createBooking
// updatePaymentInBooking

const { validationResult } = require("express-validator");
const Booking = require("../models/bookings");
const User = require("../models/user");

exports.getBookingById = (req, res, next, id) => {
    Booking.findById(id)
    .populate('parentId babyId invoiceId').exec((error, booking) => {
        if(error || !booking){
            return res.status(400).json({
                error: "Unable to find Booking"
            })
        }
        req.booking = booking;
        next();
    })
};


exports.getAllBookings= (req,res) =>{
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 9

    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt"

    Booking.find()
    .sort([[sortBy, 'descending']])
    .populate('parentId')
    .limit(limit)
    .exec((err, rides) => {
        if(err){
            return res.status(400).json({
                error: "No rides found"
            })
        }
        return res.json({
            rides: rides
        })
    })
}
exports.getBooking = (req,res) => {
    return res.json({
        booking: req.booking
    })
}

exports.createBooking = (req,res)=>{

    const errors = validationResult(req);

    // checking for validation errors
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.errors
        })//422- Unprocessable entity
    }
    
    
    const booking = new Booking(req.body);
    booking.parentId = req.profile._id
    booking.save((err, booking) =>{
        if(err){
            return res.status(400).json({
                error:[{
                    param: "general",
                    msg: `${err}`
                }]  
            })
        }
        req.booking = booking;

        User.findByIdAndUpdate(req.profile._id,{
            $push: {
                "bookings": booking._id
            }
        },
        {new: true, useFindAndModify: false },
        (error, user)=>{
            if(error){
                return res.status(400).json({
                    err: [{
                        param: "general",
                        msg: "Unable to add booking in user profile"
                    }]   
                })
            }
            return res.json({
                message: "Booked successfully"
            })  
        })
    })
}

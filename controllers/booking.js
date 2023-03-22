// getBookingById
// getAllBookings
// createBooking
// updatePaymentInBooking

const { validationResult } = require("express-validator");

const Booking = require("../models/bookings");
const User = require("../models/user");

exports.getBookingById = (req, res, next, id) => {
    
    Booking.findById(id)
    .populate('parentId babyId invoiceId babysitter').exec((error, booking) => {
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
    .populate('parentId babyId babysitter')
    // .limit(limit)
    .exec((err, bookings) => {
        if(err){
            return res.status(400).json({
                error: "No bookings found"
            })
        }
        return res.json({
            bookings: bookings
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

exports.approveBooking = (req,res) => {

    Booking.findByIdAndUpdate(req.booking._id,
        {
            status : 'Approved'
        },
        {new: true, useFindAndModify: false },
        (error,booking) => {
            if(error){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg:"Something went wrong. Please try again"
                    }]
                })
            }
            return res.json({
                booking: booking,
                message: "Booking approved successfully"
            })  
        })
}
exports.rejectBooking = (req,res) => {
    Booking.findByIdAndUpdate(req.booking._id,
        {
            status : 'Rejected'
        },
        {new: true, useFindAndModify: false },
        (error,booking) => {
            if(error){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg:"Something went wrong. Please try again"
                    }]
                })
            }
            return res.json({
                booking: booking,
                message: "Booking rejected successfully"
            })  
        })
}
exports.updatePaymentInBooking = (req,res,next) => {

    Booking.findByIdAndUpdate(req.params.bookingId,
        {
            invoiceId : res.locals.invoice._id,
            paymentStatus: true
        },
        {new: true, useFindAndModify: false },
        (error,booking) => {
            if(error){
                return res.status(400).json({
                    error: [{
                        param: "general",
                        msg:"Something went wrong. Please try again"
                    }]
                })
            }
            next()
        })
}
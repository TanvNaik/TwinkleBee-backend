const express = require("express");
const { check } = require('express-validator');
const router = express.Router();

const {
    isSignedIn,
    isAuthenticated,
    isAdmin
} = require("../controllers/authentication")

const {
    getUserById, getBabyById    
} = require("../controllers/user")

const {
    getAllBookings,
    getBookingById,
    getBooking,
    createBooking,
    approveBooking,
    rejectBooking
} = require("../controllers/booking")

// PARAMs
router.param("userId", getUserById)
router.param("babyId", getBabyById)
router.param("bookingId", getBookingById)

// GET
router.get("/bookings", getAllBookings)
router.get("/booking/:bookingId",  getBooking);


//PUT
router.put("/approve/:userId/:bookingId",  isAdmin, approveBooking )
router.put("/reject/:userId/:bookingId",  isAdmin, rejectBooking )

//POST
//add validations
router.post("/createBooking/:userId",createBooking);


module.exports = router
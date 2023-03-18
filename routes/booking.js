const express = require("express");
const { check } = require('express-validator');
const router = express.Router();

const {
    isSignedIn,
    isAuthenticated
} = require("../controllers/authentication")

const {
    getUserById    
} = require("../controllers/user")

const {
    getAllBookings,
    getBookingById,
    getBooking,
    createBooking
} = require("../controllers/booking")


// GET
router.get("/getAllBookings", getAllBookings)
router.get("/booking/:bookingId",  getBooking);


//POST
//add validations
router.post("/createBooking/:userId",createBooking);



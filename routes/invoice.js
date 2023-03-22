const express = require("express");
const router = express.Router();
const cors = require('cors');


const {
    getInvoiceById,
    addInvoice,
    getBookingInvoice
} = require("../controllers/invoice")
const { updatePaymentInBooking, getBookingById } = require("../controllers/booking");
const { updatePaymentInUser, getUserById } = require("../controllers/user");


// PARAMs
router.param("/invoiceId", getInvoiceById)
router.param("/userId", getUserById)
router.param("/bookingId", getBookingById)

//GET
router.get("/invoices/:bookingId", getBookingInvoice)

// POST
router.post("/create/invoice/:bookingId/:userId",addInvoice,  updatePaymentInBooking , updatePaymentInUser );


module.exports = router;
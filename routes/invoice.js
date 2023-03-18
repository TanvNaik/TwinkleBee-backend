const express = require("express");
const router = express.Router();

const {
    getInvoiceById,
    addInvoice,
    getBookingInvoices
} = require("../controllers/invoice")
const { updatePayemtInRide } = require("../controllers/ride");
const { updatePaymentInUser } = require("../controllers/user");


// PARAMs
router.param("/invoiceId", getInvoiceById)

//GET
router.get("/invoices/:bookingId", getBookingInvoices)

// POST
router.post("/create/invoice/:rideId/:userId",addInvoice,  updatePayemtInRide , updatePaymentInUser );


module.exports = router;
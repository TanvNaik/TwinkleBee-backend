//DONE
const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    babyId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    //weekly, monthly, yearly
    duration: {
        type: String
    },
    //hours per day
    hours:{
        type: String
    },
    fees: {
        type: Number
    },
    invoiceId:{
        type: mongoose.Schema.ObjectId,
        ref: "Invoice",
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
},{timestamps:true})
module.exports = mongoose.model("Booking", bookingSchema)
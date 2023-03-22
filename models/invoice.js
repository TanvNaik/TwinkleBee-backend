const mongoose = require("mongoose");


const invoiceSchema = mongoose.Schema({
    parent: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
    },
    invoiceAmount: Number,
    babyId:{
        type: mongoose.Schema.ObjectId, 
        ref: 'Baby', 
    },
    bookingId:{
        type: mongoose.Schema.ObjectId, 
        ref: 'Booking', 

    }

},{timestamps:true})



module.exports = mongoose.model("Invoice", invoiceSchema)
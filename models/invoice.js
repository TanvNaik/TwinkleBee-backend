//DONE
const mongoose = require("mongoose");


const invoiceSchema = mongoose.Schema({
    invoiceAmount: Number,
    babyId:{
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
    },
    bookingId:{
        type: mongoose.Schema.ObjectId, 
      ref: 'Booking', 

    }

},{timestamps:true})



module.exports = mongoose.model("Invoice", invoiceSchema)
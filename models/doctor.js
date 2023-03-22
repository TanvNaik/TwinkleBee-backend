const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    gender:{
      type: String
    },
    contact1:{
        type: Number
    },
    contact2:{
        type: Number
    },
    address:{
        type: String
    }
    
},{timestamps: true})

module.exports = mongoose.model("Doctor", doctorSchema);
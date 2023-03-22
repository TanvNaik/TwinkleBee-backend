const mongoose = require('mongoose');
const babySchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    babysitter:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    gender:{
      type: String
    },
    profile_pic:{
        type: String
    },
    height: Number,    
    weight: Number,
    age: Number,
    dob: Date,
    vaccination:{
        type: [String], 
        default:[]
      },
    doctors:{
        type:[mongoose.Schema.ObjectId],
        ref: "Doctor",
        default: []
    },
    address:{
        type: String
    }
    
},{timestamps: true});


module.exports = mongoose.model("Baby", babySchema);
const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const feedbackSchema = mongoose.Schema({
    feedbacker: {
        type: ObjectId,
        ref: "User"   
    },
    receiver: {
        type: ObjectId,
        ref: "User"
    },
    feedbackText:{
        type: String
    },
    rating:{
        type: Number,
    } 

},{timestamps: true})
module.exports = mongoose.model("Feedback", feedbackSchema);
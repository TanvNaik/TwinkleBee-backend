const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const messageSchema = mongoose.Schema({
    conversationId: {
        type: ObjectId,
        ref: "Conversation"
    },
    sender:{
        type: ObjectId,
        ref: "User"
    },
    content:{
        type: String,
        trim: true
    }
},{timestamps:true})



module.exports = mongoose.model("Message", messageSchema)
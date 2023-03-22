
const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    members: {type: [mongoose.Schema.ObjectId], 
    ref: 'User', 
    default: []
}
},{timestamps:true})

module.exports = mongoose.model("Conversation", conversationSchema)
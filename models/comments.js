const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    
    text:{
      type: String
    },
    Commenter:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
    
},{timestamps: true})

module.exports = mongoose.model("Comments", commentSchema);
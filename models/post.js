const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        trim: true,
    },
    image:{
      type: String
    },
    babysitterId:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    likes:{
        type: [mongoose.Schema.ObjectId], 
        ref: 'User', 
          default: []    },
    comments:{
        type: [mongoose.Schema.ObjectId], 
      ref: 'Comments', 
        default: []
    }
    
},{timestamps: true})

module.exports = mongoose.model("Post", postSchema);
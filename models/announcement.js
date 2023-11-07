const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true
      }
},{timestamps: true})

module.exports = mongoose.model("Announcement", announcementSchema);
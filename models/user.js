/* 
role- 0 admin
role- 1 babysitter
role- 2 parent
*/
const mongoose = require('mongoose');
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    username:{
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true
    },
    email:{
        type: String,
      trim: true,
      unique: true
    },
    baby:{
      type: [mongoose.Schema.ObjectId], 
      ref: 'Baby', 
        default: []
    },
    gender:{
      type: String
    },
    adhaarNumber: String,
    occupation: String,
    encry_password:{
        type: String,
        required: true
    },
    salt: String,
    payments:{
      type: [mongoose.Schema.ObjectId], 
      ref: 'Invoice', 
        default: []
    },
    feedbacks:{
      type: [mongoose.Schema.ObjectId], 
      ref: 'Feedback', 
      default:[]
    },
    contactNumber:{
        type: Number,
    },
    profile_pic:{
        type: String
    },
    role:{
      type: Number,
      default: 2
    },
    bookings:{
      type: [mongoose.Schema.ObjectId], 
      ref: 'Booking', 
      default:[]
    }   ,
    verificationStatus: {
      type: Boolean,
      default: false
    }
},{timestamps: true});

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password
      ? true
      : false;
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
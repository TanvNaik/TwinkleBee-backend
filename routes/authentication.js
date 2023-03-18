const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const multer = require("multer");
const {signup, signin,signout} = require("../controllers/authentication");
const path = require("path")

const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,path.join(__dirname, "../uploads/images"))  
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine})

// GET routes
router.get("/signout", signout); 
router.get("/test",  (req,res)=>{
    res.json("hello from backend");
})


// POST routes
router.post("/signin",signin) 
router.post("/signup",upload.fields([{
    name: 'pp', maxCount: 1
  }]), [
    check("name")
    .isLength({min: 3})
    .withMessage("Name should be atleast 3 characters")
    .isAlpha()
    .withMessage("Name should not contain any numbers"),
    

    check("username")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric ")
    .isLength({min:6})
    .withMessage("Username must be atleast 6 characters"),

    check("email")
    .isEmail()
    .withMessage("Enter valid email-id"),  

    check("password")
    .isLength({min: 8})
    .withMessage("Password must be minimum 8 characters ")
    .isAlphanumeric()
    .withMessage("Password must be alphanumeric"),

    check("gender")
    .isLength({min: 1})
    .withMessage("Gender is Required"),
    

    check("contactNumber")
    .isLength({min: 10, max: 10})
    .withMessage('Mobile number should be 10 digits only')

] , signup )



module.exports = router;
const express = require('express')
const router = express.Router();
const multer = require("multer");
const path = require("path")

const nodemailer = require('nodemailer')
const {check} = require("express-validator")

const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/authentication")

const {
    getUserById, getUserFeedBacks, getUser, addBaby, addVaccination, getBabyById, getUserBabies, addDoctor, getBaby, getAllBabysitters, verifyBabySitter, deleteBabysitter, getUserBookings, assignBabysitter, writeFeedback, getAssignedBookings
} = require("../controllers/user");


const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,path.join(__dirname, "../uploads/images"))  
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine})

// PARAMs
router.param("userId", getUserById)
router.param("babyId", getBabyById)

// GET
router.get("/user/:findUser",  getUser);
router.get("/baby/:findBaby", getBaby);
router.get('/babysitters', getAllBabysitters)
router.get("/feedbacks/user/:userId", getUserFeedBacks);
router.get("/:userId/getBabies", getUserBabies)
router.get("/:userId/getbookings", getUserBookings);
router.get("/:userId/get-assigned-bookings", getAssignedBookings);



// POST
router.post("/addBaby/:userId", upload.fields([{
    name: 'pp', maxCount: 1
}]), [
    check("name")
    .isLength({min:3})
    .withMessage("Name should be atleast 3 characters")
    .isAlpha()
    .withMessage("Name should not contain any numbers"),

    check("gender")
    .isLength({min: 1})
    .withMessage("Gender is Required"),

    check("height")
    .isLength({min: 1})
    .withMessage("Please enter height"),

    check("weight")
    .isLength({min: 1})
    .withMessage("Please enter weight"),

    check("dob")
    .isLength({min: 1})
    .withMessage("Please specify date of birth")
],addBaby)
router.post("/addVaccine/:babyId", addVaccination)
router.post("/addDoctor/:babyId", [
    check('name')
    .isLength({min: 3})
    .withMessage("Name should be atleast 3 characters long")
    ,

    check("gender")
    .isLength({min: 1})
    .withMessage("Gender is required")

], addDoctor)
router.post("/assign/:babysitterId/:bookingId", assignBabysitter)
router.post("/writeFeedback/:feedbacker/:feedbackReceiver",  writeFeedback)


// PUT
router.put("/verify/:userId/:babysitterId", isAdmin, verifyBabySitter)


// DELETE 
router.delete("/delete/:userId/:babysitterId", isAdmin, deleteBabysitter)






// const transport = {
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use TLS
//     auth: {
//         user: process.env.SMTP_TO_EMAIL,
//         pass: process.env.SMTP_TO_PASSWORD,
//     },
//     }

// const transporter = nodemailer.createTransport(transport)

// transporter.verify((error, success) => {
//     if (error) {
//         //if error happened code ends here
//         console.error(error)
//     } else {
//         //this means success
//         console.log('Ready to send mail!')
//     }
// })


// router.post('/send-mail', (req, res) => {
//         //make mailable object
//         const mail = {
//         from: process.env.SMTP_FROM_EMAIL,
//         to: process.env.SMTP_TO_EMAIL,
//         subject: 'New Contact Form Submission',
//         text: `
//           from:
//           ${req.body.email}
    
//           message:
//           ${req.body.message}`,
//         }
//         transporter.sendMail(mail, (err, data) => {
//             if (err) {
//                 return res.status(400).json({
//                     error: 'Failed to send mail',
//                 })
//             } else {
//                 return res.json({
//                     status: 'success',
//                 })
//             }
//         })
//     })
    

module.exports = router;
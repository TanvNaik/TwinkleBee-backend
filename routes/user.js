const express = require('express')
const router = express.Router();
const multer = require("multer");
const path = require("path")

const nodemailer = require('nodemailer')
const {check} = require("express-validator")

const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/authentication")

const {
    getUserById, getUserFeedBacks,getUserRides, getUser, 
    updateUser,writeFeedback,getUserPayments, addVehicle,
    verifyUser, showPendingVerifications,getUserVehicles,
    checkUsernameAndEmail, changePassword
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


// GET
router.get("/user/:userId/:findUser", isSignedIn, isAuthenticated, getUser);
router.get("/feedbacks/user/:userId", getUserFeedBacks);
router.get("/rides/user/:userId",getUserRides);
router.get("/payments/user/:userId", getUserPayments)
router.get("/vehicles/user/:userId", isSignedIn, isAuthenticated, getUserVehicles)

// PUT
router.put("/user/:userId", isSignedIn, isAuthenticated,updateUser);
router.put("/:userId/changePassword", changePassword)


// POST
router.post("/writeFeedback/:feedbacker/:feedbackReceiver",  writeFeedback)

router.post("/addVehicle/user/:userId",upload.fields([{
    name: "license", maxCount:1
},{
    name: "vehicleInsurance", maxCount: 1
},{
    name: "vehicleRC", maxCount: 1
}]), [
    check("model")
    .isLength({min: 1})
    .withMessage("Please provide model name"),

    check("namePlate")
    .isAlphanumeric()
    .withMessage("Enter valid nameplate number"),

    check("numberOfSeats")
    .isLength({min: 1})
    .withMessage("Number of seats can't be empty")

],addVehicle) 

router.post("/checkUsernameAndEmail", checkUsernameAndEmail )

//Admin
router.get("/pendingUserVerifications/:userId", isSignedIn, isAuthenticated, isAdmin, showPendingVerifications)
router.put("/verify-user/:userId", isSignedIn, isAuthenticated, isAdmin, verifyUser);



const transport = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.SMTP_TO_EMAIL,
        pass: process.env.SMTP_TO_PASSWORD,
    },
    }

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        //if error happened code ends here
        console.error(error)
    } else {
        //this means success
        console.log('Ready to send mail!')
    }
})


router.post('/send-mail', (req, res) => {
        //make mailable object
        const mail = {
        from: process.env.SMTP_FROM_EMAIL,
        to: process.env.SMTP_TO_EMAIL,
        subject: 'New Contact Form Submission',
        text: `
          from:
          ${req.body.email}
    
          message:
          ${req.body.message}`,
        }
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Failed to send mail',
                })
            } else {
                return res.json({
                    status: 'success',
                })
            }
        })
    })
    

module.exports = router;
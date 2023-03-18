const express = require("express");
const router = express.Router();

const {getUserConversations,
    createConversation,
    createMessage,
    getMessage
} = require("../controllers/conversation")

const {
    getUserById
}= require("../controllers/user")
const {
    isSignedIn,
    isAuthenticated
}= require("../controllers/authentication")

// PARAMs 
router.param("userId",getUserById)


// GET
router.get("/getUserConversations/:userId", isSignedIn, isAuthenticated, getUserConversations)
router.get("/:conversationId", getMessage)



// POST
// in req.body => sender, receiver, content
router.post("/createMessage", createMessage)
router.post("/createConversation", createConversation)



module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    isSignedIn,
    isAuthenticated,
    isAdmin
} = require("../controllers/authentication")
const {
    getAllPosts,
    getPostById,
    getPost,
    createPost,
    updateLikesInPost,
    updateCommentInPost,
    addComment
} = require("../controllers/post")

const path = require("path");
const { getUserById } = require("../controllers/user");

const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,path.join(__dirname, "../uploads/posts"))  
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine})


//TODO: Update post routes
// PARAMs
router.param("userId", getUserById)
router.param("postId", getPostById)

// GET routes
router.get("/posts/all", getAllPosts)
router.get("/post/:postId",  getPostById);


// POST routes
router.post("/createPost/:userId",upload.fields([{
    name: 'image', maxCount: 1
  }]), createPost);

//PUT routes
router.put("/like/:postId/:userId",  updateLikesInPost);
router.put("/comment/:postId/:userId",  addComment,updateCommentInPost);


module.exports = router;
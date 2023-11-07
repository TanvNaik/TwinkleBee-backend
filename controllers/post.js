const { validationResult } = require("express-validator");
const Post = require("../models/post")
const User = require("../models/user")
const Comment = require("../models/comments")

exports.getPostById = (req,res, next, id)=>{
    Post.findById(id)
    .populate('likes comments babysitterId')
    .exec((error,post)=>{
        if(error || !post){
            return res.status(400).json({
                error: "Unable to find post"
            })
        }
        req.post = post;
        next();
    })
}
exports.getPost = (req,res) => {
    return res.json({
        post: req.post
    })
}
exports.getAllPosts= (req,res) =>{
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 9

    let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt"

    Post.find()
    .sort([[sortBy, 'descending']])
    .populate('babysitterId comments')
    .limit(limit)
    .exec((err, posts) => {
        if(err){
            return res.status(400).json({
                error: "No posts found"
            })
        }
        return res.json({
            posts: posts
        })
    })
}

exports.createPost = (req,res)=>{

    const errors = validationResult(req);

    // checking for validation errors
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.errors
        })//422- Unprocessable entity
    }
    
    

    const post = new Post(req.body);
    post.babysitterId = req.profile._id
    post.image = req.files.image[0].filename;
    post.save((err, post) =>{
        if(err){
            return res.status(400).json({
                error:[{
                    param: "general",
                    msg: `${err}`
                }]  
            })
        }
        req.post = post;

        User.findByIdAndUpdate(req.profile._id,{
            $push: {
                "posts": post._id
            }
        },
        {new: true, useFindAndModify: false },
        (error, user)=>{
            if(error){
                return res.status(400).json({
                    err: [{
                        param: "general",
                        msg: "Unable to add post in user profile"
                    }]   
                })
            }
            return res.json({
                msg: "Posted successfully"
            })  
        })
    })
}

exports.updateLikesInPost = (req,res)=>{
    Post.findByIdAndUpdate(req.post._id,
        {$push: { 'likes': req.profile._id}},
        {new: true, useFindAndModify: false},
        (err, post) => {

            if(err){
                return res.status(400).json({
                    error: "Unable to like the post"
                })
            }
            
        }
    )
}

//route => /addComment/:commenter
exports.addComment = (req,res) =>{
    const comment = new Comment(req.body);
    comment.commenter = req.profile._id
    comment.save((err, comment) =>{
        if(err){
            return res.status(400).json({
                error:[{
                    param: "general",
                    msg: `${err}`
                }]  
            })
        }
    })
}

exports.updateCommentInPost = (req,res) => {
    Post.findByIdAndUpdate(req.params.postId, { $push: { comments: req.profile._id  }}, {new: true, useFindAndModify: false},(err, post) => {
        if(err){
            return res.status(400).json({
                error: "Unable to post comment"
            })
        }
        User.findByIdAndUpdate(
            req.params.passengerId,
            {
                $pull: { "rides": req.params.rideId}
            },
            {new: true},
            (err,user)=>{
                if(err){
                    return res.status(400).json({
                        error: "Cannot remove passenger"
                    })
                }
                return res.json({
                    message: "Passenger removed successfully"
                })
            })
    
        
    } )
}
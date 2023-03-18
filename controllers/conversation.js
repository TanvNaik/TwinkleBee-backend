const Conversation = require("../models/conversation")
const Message = require("../models/message")

exports.getUserConversations = (req,res)=>{
    Conversation.find({"members": {
        $in : 
        [ req.profile._id ]
        }
    }).populate("members")
    .exec((err, conversations) => {
        if(err){
            return res.status(400).json({
                error: "Unable to fetch conversations"
            })
        }
        return res.json({
            conversations: conversations
        })
    })
}

exports.createConversation = (req,res) => {
    
    const conversation = new Conversation({
        members: [req.body.sender, req.body.receiver]
    })

    conversation.save((err, conversation) =>{
        if(err){
            return res.status(400).json({
                error: "Unable to create the Conversation"
            })
        }
        return res.json({
            conversation: conversation
        })
    })
}

exports.createMessage = (req,res) => {
    const message = new Message({
        conversationId: req.body.conversationId,
        sender: req.body.sender,
        content: req.body.content
    })

    message.save((err, message) => {
        if(err){
            return res.status(400).json({
                error: "Cannot save the message"
            })
        }
        return res.json({
            message: message
        })
    })
}
exports.getMessage = (req,res) => {
    Message.find({
        conversationId: {
            $in : [req.params.conversationId]
            }
        })
        .populate("sender")
        .exec((err, message) => {
            if(err){
                return res.status(400).json({
                    error: err
                })
            }
            return res.json({
                message: message
            })
        }
    )
}


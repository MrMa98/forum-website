const mongoose = require('mongoose');
const { ForumPost } = require('./forumPost');

const CommentariesModel = mongoose.model('CommentariesModel', new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: {
            message: '请确认发帖人'
        },
        ref: UserModel,
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: {
            message: '请确认发帖人'
        },
        ref: ForumPost
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId | null,
    },
    commentaries_text: {
        type: String,
        required: {
            message: '请添加内容'
        },
    },
    create_at: {
        type: Date, 
        default: Date.now, 
      },
    updated_at: Date,
    isDelete: {
        type: Boolean,
        default: false,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
}))

module.exports = {
    CommentariesModel
}
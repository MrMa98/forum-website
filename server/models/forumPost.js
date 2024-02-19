const mongoose = require('mongoose');
const { UserModel } = require('./user')

const ForumPostModel = mongoose.model('ForumPostModel', new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: {
            message: '请确认发帖人'
        },
        ref: UserModel,
    },
    post_caption: {
        type: String,
        required: {
            message: '请添加标题'
        },
    },
    post_text: {
        type: String,
        required: {
            message: '请添加内容'
        },
    },
    post_type: [{
        type: String,
    }],
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
    ForumPostModel
}
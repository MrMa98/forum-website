const mongoose = require('mongoose');
const { UserModel } = require('./user');
const { ForumPostModel } = require('./forumPost');

const CommentChildrenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: UserModel, // 关联到用户模型
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ForumPostModel, // 关联到话题模型
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    mention_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: UserModel, // 关联到用户模型
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    comment_text: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
});

const CommentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: UserModel, // 关联到用户模型
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: ForumPostModel, // 关联到话题模型
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    comment_text: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    children: [CommentChildrenSchema], // 嵌套的 CommentModel 模式
});

const CommentModel = mongoose.model('CommentModel', CommentSchema);

module.exports = { CommentModel };

const mongoose = require('mongoose');
const { ForumPostModel } = require('./forumPost');
const { UserModel } = require('./user');

const OperationModel = mongoose.model('OperationModel', new mongoose.Schema({
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
    operation: {
        type: String,
        required: true,
        enum: ['add', 'update', 'delete', 'recover']
    },
    operation_at: {
        type: Date,
        default: Date.now,
    },
}))

module.exports = {
    OperationModel
}
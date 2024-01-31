const mongoose = require('mongoose');
const { UserModel } = require('./user');

const KudosModel = mongoose.model('KudosModel', new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: UserModel, // 关联到用户模型
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    targetType: {
        type: String,
        enum: ['post', 'comment'], // 枚举，表示点赞的目标类型，可以是帖子或评论
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}))

module.exports = {
    KudosModel
}
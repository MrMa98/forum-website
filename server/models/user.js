const mongoose = require('mongoose');
const validateLength = function (arg) {
    console.log(arg);
    if (arg.length) {
        return true;
    }
    return false;
};
/** 
 * ^: 匹配字符串的开头
匹配一个或多个大小写字母、数字、下划线、百分号、加号、减号或点号，表示邮箱用户名部分
@: 匹配@字符
匹配一个或多个大小写字母、数字、减号或点号，表示邮箱域名的第一部分
匹配点号
匹配两个或更多大小写字母，表示邮箱域名的顶级域名部分（例如com、net等）
匹配字符串的结尾
 */
const validateEmail = function (arg) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegex.test(arg);
    if (isValidEmail) {
        return true;
    }
    return false;
};
/** 1开头 前三位没有2  11位 */
const validatePhone = function (num) {
    const phoneRegex = /^1[3456789]\d{9}$/;
    const isValidPhone = phoneRegex.test(num);
    if (isValidPhone || !num) {
        return true;
    }
    return false;
}
const UserModel = mongoose.model('UserModel', new mongoose.Schema({    // 定义模型的结构
    /** 用户名 */
    username: {
        type: String,
        required: {
            message: '请填写账号信息'
        },
        validate: {
            validator: validateLength,
            message: '请填写大于八位的账号'
        },
    },
    sex: {
        type: String,
        required: {
            message: '请选择性别'
        },
    },
    /** 邮件 */
    email: {
        type: String,
        required: {
            message: '请填写邮件信息'
        },
        validate: {
            validator: validateEmail,
            message: '请填写正确格式的邮件'
        },
    },
    /** 密码 */
    password: {
        type: String,
        required: {
            message: '请填写密码'
        },
        validate: {
            validator: validateLength,
            message: '请填写大于八位的密码'
        },
    },
    /** 昵称 */
    nickname: {
        type: String,
    },
    /** 手机 */
    phone: {
        type: Number,
        validate: {
            validator: validatePhone,
            message: '手机号可以不填但不能乱填'
        }
    },
    /** 地址 */
    address: String,
    /** 出生日期 */
    birthday: {
        type: Date,
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
}));

module.exports = { UserModel };
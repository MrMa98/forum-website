module.exports = {
    /** toke失效或过期，请重新登陆 */
    TOKENFAILURE: {
        code: 2024,
        message: 'toke失效或过期，请重新登陆',
        data: null,
    },
    /** toke校验失败，请重新登陆 */
    TOKENFAIL: {
        code: 2025,
        message: 'toke校验失败，请重新登陆',
        data: null,
    },
    /** session失效或过期，请重新登陆 */
    SESSIONFAILURE: {
        code: 2026,
        message: 'session失效或过期，请重新登陆',
        data: null,
    },
    /** session校验失败，请重新登陆 */
    SESSIONFAIL: {
        code: 2027,
        message: 'session校验失败，请重新登陆',
        data: null,
    },
    /** 用户名或密码错误 */
    ACCOUNTPASSWORDMISMATCH: {
        code: 2028,
        message: '用户名或密码错误',
        data: null,
    },
    /** 服务器异常注册失败 */
    REGISTRATIONFAIL: {
        code: 2029,
        message: '服务器异常注册失败',
        data: null,
    },
    /** 服务器异常获取用户信息失败 */
    FINDUSERINFOFAIL: {
        code: 2030,
        message: '服务器异常获取用户信息失败',
        data: null,
    },
    /** 请选择要删除的话题 */
    DELETEBYIDFAIL: {
        code: 2031,
        message: '请选择要删除的话题',
        data: null,
    },
    /** 请填写要查询的关键字 */
    SEARCHBYNAMEFAIL: {
        code: 2032,
        message: '请填写要查询的关键字',
        data: null,
    },
    /** 请填写要查询id */
    SEARCHBYBYIDFAIL: {
        code: 2033,
        message: '请填写要查询id',
        data: null,
    },
    /** 请选择要修改的话题 */
    EDITBYBYIDFAIL: {
        code: 2034,
        message: '请选择要修改的话题',
        data: null,
    },
    /** 恢复失败该话题已存在 */
    RECOVERBYBYIDFAIL: {
        code: 2035,
        message: '恢复失败该话题已存在',
        data: null,
    },
    /** 添加标签失败 */
    ADDTAGFAIL: {
        code: 2036,
        message: '服务器问题，添加标签失败',
        data: null,
    },
    /** 添加标签与默认标签相同 */
    ADDDEFAULTTAGFAIL: {
        code: 2037,
        message: '添加标签失败，添加标签与默认标签相同',
        data: null,
    },
    /** 服务器异常获取用户信息失败 */
    FINDPOSTINFOFAIL: {
        code: 2038,
        message: '服务器异常获取话题信息失败',
        data: null,
    },
    /** 服务器异常评论失败 */
    ADDCOMMENTFAIL: {
        code: 2039,
        message: '服务器异常评论失败',
        data: null,
    },
    /**
     * 返回成功的响应对象
     * @param {string} token 用户登录状态的 token 字段
     * @param {string} message 指定成功消息，默认为'请求成功'
     * @returns {Object} 包含成功状态信息的对象
     */
    SUCCESS: (token, message, data) => {
        return {
            code: 200, // 成功状态码
            message: message || '请求成功', // 成功消息，默认为'请求成功'
            token: token || null, // 用户登录状态的 token 字段
            data: data || null,
        };
    },
    SUCCESSCALLBACK: (data) => {
        return {
            code: 200,
            message: '请求成功',
            data: data,
        }
    }

}
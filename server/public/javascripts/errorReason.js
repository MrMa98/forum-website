/**
 * 获取错误信息
 * @param {*} error 
 * @returns '{ key: errormessage }'
 */
function getErrorReason(error) {
    // 当有多个验证不通过的时候
    // 这里切割需要依赖 ":" & "," 两个字符来切割（ * 所以的话提示信息中就不要使用英文的逗号了）
    let errorArray = error.toString().split(/:|,/g);
    let errorObject = {};
    for (let i = 1; i < errorArray.length; i += 2) {
        let key = errorArray[i].trim();
        let value = errorArray[i + 1].trim();
        errorObject[key] = value;
    }
    return errorObject; // console: { age: '年龄格式不正确', phone: '电话号码格式不正确' } 
}

const errorData = (firstError) => {
    return {
        code: 9999,
        message: firstError,
        data: null,
    }
}

module.exports = { getErrorReason, errorData };
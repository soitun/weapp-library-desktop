export const requiredValidator = (msg) => {
    return {
        required: true,
        message: msg,
        trigger: 'blur'
    }
}

export const integerValidator = (rule, value, callback) => {
    if (isNaN(value)) {
        callback(new Error('请输入一个整数'));
    } else {
        callback();
    }
}

export const phoneValidator = (rule, value, callback) => {
    if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('手机号格式错误'));
    } else {
        callback();
    }
}

export const phoneTest = (value) => {
    return /^1[34578]\d{9}$/.test(value);
}
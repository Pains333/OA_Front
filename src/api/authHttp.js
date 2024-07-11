import http from "@/api/http.js";

const login = (email, password) => {
    const path = '/auth/login';
    return http.post(path, {email, password})
}

const resetPwd = (oldpwd, newpwd1, newpwd2) => {
    const path = '/auth/resetpwd';
    return http.post(path, {oldpwd, newpwd1, newpwd2})
}

export default {
    login,
    resetPwd,
}
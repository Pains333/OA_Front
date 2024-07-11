import http from "@/api/http.js"

const getDepartmentStaffCount = () => {
    const path = '/home/department/staff/count'
    return http.get(path)
}

const getLatestInform = () => {
    const path = '/home/latest/inform'
    return http.get(path)
}

const getLatestAbsent = () => {
    const path = '/home/latest/absent'
    return http.get(path)
}

export default {
    getDepartmentStaffCount,
    getLatestInform,
    getLatestAbsent,
}
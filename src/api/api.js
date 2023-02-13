
// const url = "http://0.0.0.0:8080"

// const url = "https://a91c-134-17-26-206.eu.ngrok.io"
// const url = "http://192.168.1.101"
const url = `http://${window.location.hostname}`
export const API_URL = `${url}/api/safety_control/safety/action/`
export const API_IMAGES = `${url}/`
export const API_STATIC_MEDIA = `${url}/static/`
export const API_CAMERA = `${url}:8008/find_cameras/`
export const API_USERLIST = `${url}/api/staff_control/employees/admin/`
export const API_REGISTRATION = `${url}/register/`
export const API_AUTH = `${url}/auth/jwt/create/`

export const API_DASHBOARD_PAGE = (page) =>{
    return `${API_URL}?page=${page}`
}

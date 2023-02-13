
// const url = "http://0.0.0.0:8080"

// const url = "https://a91c-134-17-26-206.eu.ngrok.io"
// const url = "http://192.168.1.101"
const url = `http://${window.location.hostname}`
export const API_URL = `/api/safety_control/safety/action/`
export const API_IMAGES = ``
export const API_STATIC_MEDIA = `/static/`
export const API_CAMERA = `:8008/find_cameras/`
export const API_USERLIST = `/api/staff_control/employees/admin/`
export const API_REGISTRATION = `/register/`
export const API_AUTH = `$/auth/jwt/create/`

export const API_DASHBOARD_PAGE = (page) =>{
    return `?page=${page}`
}

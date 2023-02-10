// const url = "http://0.0.0.0:8080/"

const url = "https://2f08-134-17-26-206.eu.ngrok.io/"
// const url = "http://192.168.1.101/"

export const API_URL = `${url}api/safety/action/`
export const API_IMAGES = url
export const API_STATIC_MEDIA = `${url}static/`
export const API_CAMERA = `${url}find_cameras/`
export const API_USERLIST = `${url}api/employees/admin/`
export const API_REGISTRATION = `${url}register/`
export const API_AUTH = `${url}auth/jwt/create/`

export const API_DASHBOARD_PAGE = (page) =>{
    return `${url}api/safety/action/?page=${page}`
}

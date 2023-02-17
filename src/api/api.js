
// const url = "http://0.0.0.0:8080"

export const url = "https://11e8-134-17-26-206.eu.ngrok.io"
// const url = "http://192.168.1.101"
// const url = `http://${window.location.hostname}`
export const API_URL = `/api/safety_control/safety/action/`
export const API_IMAGES = ``
export const API_STATIC_MEDIA = `/static/`
export const API_CAMERA = `:8008/find_cameras/`
// export const API_CAMERA = `api/staff_control/locations/get_camera_images/`
export const API_USERLIST = `/api/staff_control/employees/admin/`
export const API_REGISTRATION = `/register/`
export const API_AUTH = `/auth/jwt/create/`
export const API_POSTALGORITHM = `/api/algorithms/create_process/`
export const API_ALGORITHM = '/api/algorithms/available/'
export const API_MACHINE = `/api/machine_control/action/`
export const API_POSTCAMERA = `/api/staff_control/locations/post_camera/`
export const API_CAMERASELECT = '/api/staff_control/locations/camera/'
export const API_URL_I = `${url}/api/safety_control/safety/action/`
export const API_IMAGES_I = `${url}/`
export const API_STATIC_MEDIA_I = `${url}/static/`
export const API_CAMERA_I = `${url}:8008/find_cameras/`
// export const API_CAMERA_I = `${url}/api/staff_control/locations/get_camera_images/`
export const API_USERLIST_I = `${url}/api/staff_control/employees/admin/`
export const API_REGISTRATION_I = `${url}/register/`
export const API_AUTH_I = `${url}/auth/jwt/create/`
export const API_ALGORITHM_I = `${url}/api/algorithms/available/`
export const API_MACHINE_I = `${url}/api/machine_control/action/`
export const API_POSTALGORITHM_I = `${url}/api/algorithms/create_process/`

export const API_DASHBOARD_PAGE = (page) =>{
    return `${API_URL}?page=${page}`
}
export const API_DASHBOARD_PAGE_I = (page) =>{
    return `${API_URL_I}?page=${page}`
}

export const API_REPORT_PAGE = (control,page) =>{
    return `/api/${control}/action/?page=${page}`
}

export const API_REPORT_PAGE_I = (control, page) =>{
    return `${url}/api/${control}/action/?page=${page}`
}


// const url = "http://0.0.0.0:8080"

export const url = "https://9a0a-134-17-26-206.eu.ngrok.io/"

export const API_POSTALGORITHM = `/api/algorithms/create-process/`
export const API_POSTALGORITHM_I = `${url}/api/algorithms/create-process/`

export const API_GETALGORITHMS = `/api/algorithms/get-process/`
export const API_GETALGORITHMS_I = `${url}/api/algorithms/get-process/`

export const API_ALLREPORTS = `"/api/reports/all_reports/"`
export const API_URL = `/api/safety_control/safety/action/`
export const API_IMAGES = ``
export const API_CAMERA = `:8008/find_cameras/`
export const API_USERLIST = `/api/staff-control/employees/admin/`
export const API_REGISTRATION = `/register/`
export const API_AUTH = `/auth/jwt/create/`

export const API_ALGORITHM = '/api/algorithms/available-process/'
export const API_CAMERASELECT = '/api/cameras/'
export const API_CAMERASELECT_I = `${url}/api/cameras/`

export const API_URL_I = `${url}/api/safety_control/safety/action/`
export const API_IMAGES_I = `${url}/`
export const API_CAMERA_I = `${url}:8008/find_cameras/`
export const API_USERLIST_I = `${url}/api/staff-control/employees/admin/`

export const API_GETPROCESS_I = `${url}/api/algorithms/get-process/`

export const API_DELPROCESS_I = `${url}/api/algorithms/stop-process/`
export const API_DELPROCESS = `api/algorithms/stop-process/`
export const API_REGISTRATION_I = `${url}/register/`
export const API_AUTH_I = `${url}/auth/jwt/create/`
export const API_ALGORITHM_I = `${url}/api/algorithms/available-process/`

export const API_DASHBOARD = `${url}/api/machine_control/machine_actions/2023-02-17/`

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

import axios from "axios"
import { 
    API_CAMERASELECT 
} from "./api"

export const getSelectedCameras = (hostname, cookies) => {
    if (hostname.includes("localhost")) {
        return axios.get(`http://192.168.1.101${API_CAMERASELECT}`,{
            headers:{
                "Content-Type": "application/json",
                'Authorization': cookies
              },
        })
    }else{
         return  axios.get(`http://${hostname}${API_CAMERASELECT}`,{
            headers:{
                "Content-Type": "application/json",
                'Authorization': cookies
              },
        })
    } 
  }

export const postCamera = (hostname, IPCamera, username, password, cookies) => {
    console.log(cookies)
    if (hostname.includes("localhost")) {
       return  axios.post(`http://192.168.1.101/api/staff_control/locations/post_camera/`,{
                ip: IPCamera,
                username: username,
                password: password,
                url: `http://192.168.1.101:8008/`
        },
        {
            headers: {
                'Authorization': cookies
            },
        })
    }else{
       return axios.post(`http://${hostname}/api/staff_control/locations/post_camera/`,{
        ip: IPCamera,
        username: username,
        password: password,
        url: `http://${hostname}:8008/`
},{
    headers: {
        'Authorization': cookies
    },
})
    }
}
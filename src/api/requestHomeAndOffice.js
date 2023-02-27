import axios from "axios"
import { 
    API_CAMERASELECT_I,
    API_CAMERASELECT
} from "./api"

export const getSelectedCameras = (hostname, cookies) => {
    if (hostname.includes("localhost")) {
        return  axios.post("https://5scontrol.pl/proxy_to_ngrok",{
            url: API_CAMERASELECT_I,
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                'Authorization': cookies
            }
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
    
    if (hostname.includes("localhost")) {
       return  axios.post(`http://192.168.1.101/api/cameras/create-camera/`,{
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
       return axios.post(`http://${hostname}/api/cameras/create-camera/`,{
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

export const patchCamera = (hostname, IPCamera, cameraName, cookies) => {
    if (hostname.includes('localhost')) {
       return axios.patch('http://192.168.1.101/api/cameras/update-camera/',{
            ip:IPCamera,
            name: cameraName
        },{
            headers: {
                'Authorization': cookies
              },
        })
        }
        else{
        return axios.patch(`http://${hostname}/api/cameras/update-camera/`,{
            ip:IPCamera,
            name: cameraName
        },{
            headers: {
                'Authorization': cookies
              },
        })
        }
}
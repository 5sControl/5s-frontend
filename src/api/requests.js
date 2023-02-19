import axios from "axios"
import { 
    API_AUTH, 
    API_AUTH_I, 
    API_POSTALGORITHM_I, 
    API_POSTALGORITHM, 
    API_CAMERASELECT,
    API_ALGORITHM_I,
    API_ALGORITHM,

} from "./api"
import { proxy } from "./proxy"
import { getIsInternet } from "../functions/getURL"

export const authorizationRequest = (hostname, email, password) => {
    if (getIsInternet(hostname)) {
      return  axios.post("https://5scontrol.pl/proxy_to_ngrok",{
            url: API_AUTH_I,
            method:"POST",
            headers:{
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              username: email,
              password: password,
            })
        })
    } 
    else{
        return axios.post(`http://${hostname}${API_AUTH}`, {
            "username": email,
            "password": password,
          })
    }
}

export const postAlgorithnDependences = (hostname, cookies, response) => {
  if (getIsInternet(hostname)) {
    return axios.post("https://5scontrol.pl/proxy_to_ngrok",{
      url: API_POSTALGORITHM_I,
      method:"POST",
      headers:{
          "Content-Type": "application/json",
          'Authorization': cookies
        },
      body:JSON.stringify( response )
  })
  }
  else{
    return  axios.post(`http://${window.location.hostname}${API_POSTALGORITHM}`,response )
  }
}

export const getSelectedCameras = (hostname, cookies) => {
  return  axios.get(`http://${hostname}${API_CAMERASELECT}`,{
    // axios.get(`http://192.168.1.101${API_CAMERASELECT}`,{
        headers:{
            "Content-Type": "application/json",
            'Authorization': cookies
          },
    })
}

export const getAveilableAlgorithms = (hostname, cookies) => {
  if (getIsInternet(hostname)){
   return  proxy(API_ALGORITHM_I, "GET", {
        'Authorization': cookies
      })

   }
else{
  return axios.get(`http://${hostname}${API_ALGORITHM}`,{
        headers: {
        'Authorization': cookies
        },
    })
}
}
import axios from "axios"
import { API_AUTH, API_AUTH_I } from "./api"
import { getIsInternet } from "../functions/getURL"

export const authorizationRequest = (isInternet, email, password) => {
    if (getIsInternet(isInternet)) {
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
        return axios.post(`http://${window.location.hostname}${API_AUTH}`, {
            "username": email,
            "password": password,
          })
    }
}
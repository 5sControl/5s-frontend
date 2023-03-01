import { getIsInternet } from "./getURL"
import { proxy } from "./proxy"
import axios from "axios"
import {url} from './api'

const API_CompanyInfo = 'api/company/info/'
const API_CreateLicense = 'api/company/create_license/'

export const getCompanyInfo = (hostname, cookies) => {
    if (getIsInternet(hostname)){
     return  proxy(url+API_CompanyInfo, "GET", {
          'Authorization': cookies
        })
     }
  else{
    return axios.get(`http://${hostname}/${API_CompanyInfo}`,{
          headers: {
          'Authorization': cookies
          },
      })
  }
  }
export const authorizationRequest = (hostname, cookies, key) => {
if (getIsInternet(hostname)) {
    return  axios.post("https://5scontrol.pl/proxy_to_ngrok",{
        url: `${url + API_CreateLicense}`,
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            'Authorization': cookies
        },
        body:JSON.stringify({
            "license_key": key
        })
    })
} 
else{
    return axios.post(`http://${hostname}/${API_CreateLicense}`, {
            "license_key": key
        },
        {
            headers:{
                "Content-Type": "application/json",
                'Authorization': cookies
            }
        })
}
}
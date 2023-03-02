import axios from "axios"
import { 
    API_POSTALGORITHM_I, 
    API_POSTALGORITHM, 
    API_ALGORITHM_I,
    API_ALGORITHM,
    API_GETPROCESS_I,
    API_DELPROCESS_I,
    API_DELPROCESS,
    url
} from "./api"
import { proxy } from "./proxy"
import { getIsInternet } from "./getURL"

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

export const getProcess = (hostname, cookies ) => {
  if (getIsInternet(hostname)){
    return  proxy(API_GETPROCESS_I, "GET", {
      'Authorization': cookies
    })
  }
  else{
   return  axios.get(`http://${hostname}/api/algorithms/get-process/`, {
                headers: {
                  "Authorization": cookies
                },
              })
  }
}

export const deleteProcess = (hostname, cookies, pid ) => {
  if (getIsInternet(hostname)){
   return axios.post("https://5scontrol.pl/proxy_to_ngrok",{
        url: API_DELPROCESS_I,
        method:"POST",
        headers:{
          "Content-Type": "application/json",
          "Authorization": cookies
        },
        body:JSON.stringify({
          pid: pid,
        })
    })
}
else{
      return  axios.post(`${url}${API_DELPROCESS}`, {
        "pid":pid
        },
        {
          headers:{
            "Content-Type": "application/json",
            'Authorization': cookies,
          }
        }
      )
}
}
export const postAlgorithnDependences = async (hostname, cookies, response) => {

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
    return  axios.post(`http://${hostname}${API_POSTALGORITHM}`,
    response, 
    {
      headers:{
        "Content-Type": "application/json",
        'Authorization': cookies,
      }
    }
  )
  }
}
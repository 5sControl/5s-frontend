import axios from "axios";

export const proxy =  (URL, method, headers) =>{
   return axios.post("https://5scontrol.pl/proxy_to_ngrok",{
      url: URL,
      method: method,
      headers: headers
    })
}
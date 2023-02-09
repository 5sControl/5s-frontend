import axios from "axios";

export const proxy =  (type, URL, method, headers) =>{
    if (type ==='internet'){
        return axios.post("https://5scontrol.pl/proxy_to_ngrok",{
            url: URL,
            method: method,
            headers: headers,
        })
    }else{
        return axios.get(URL,{
            headers: headers,
          })
    }
  
}

import axios from "axios"

import { proxy } from "./proxy"
import { getIsInternet } from "./getURL"
import { url } from "./api"

export const getDashboardDate = (hostname, cookies, date) => {
    if (getIsInternet(hostname)){
    return  proxy(`${url}/api/dashboard/${date}/`, "GET", {
        'Authorization': cookies
      })
    }
    else{
    return  axios.get(`http://${hostname}/api/dashboard/${date}/`,{
            headers: {
              'Authorization': cookies
            },
          })
      }
  }
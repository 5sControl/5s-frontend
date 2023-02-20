import axios from "axios"

import { proxy } from "./proxy"
import { getIsInternet } from "./getURL"

export const getDashboardDate = (hostname, cookies, date) => {
    if (getIsInternet(hostname)){
    return  proxy(`/api/dashboard/${date}/`, "GET", {
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
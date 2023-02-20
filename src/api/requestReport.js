import axios from "axios"

import { proxy } from "./proxy"
import { getIsInternet } from "./getURL"
import { url } from "./api"

export const getDashboardDate = (hostname, cookies, date) => {
    if (getIsInternet(hostname)){
    return  proxy(`${url}/api/reports/all_reports/`, "GET", {
        'Authorization': cookies
      })
    }
    else{
    return  axios.get(`http://${hostname}/api/reports/all_reports/`,{
            headers: {
              'Authorization': cookies
            },
          })
      }
  }
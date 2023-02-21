import axios from "axios"

import { proxy } from "./proxy"
import { getIsInternet } from "./getURL"
import { url } from "./api"

const URL_DASHBOARD = '/api/reports/all_reports/2023-02-20/'
export const getDashboardDate = (hostname, cookies, date) => {
    if (getIsInternet(hostname)){
    return  proxy(`${url + URL_DASHBOARD}`, "GET", {
        'Authorization': cookies
      })
    }
    else{
    return  axios.get(`http://${hostname + URL_DASHBOARD}`,{
            headers: {
              'Authorization': cookies
            },
          })
      }
  }
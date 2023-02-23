/* eslint-disable no-unused-vars */
import axios from "axios";

import { proxy } from "./proxy";
import { getIsInternet } from "./getURL";
import { url } from "./api";

// const URL_DASHBOARD = '/api/reports/all_reports/'
const URL_DASHBOARD = "api/reports/search/";

export const getDashboardDate = (hostname, cookies, date, startTime, endTime) => {
  if (getIsInternet(hostname)) {
    return proxy(`${url + URL_DASHBOARD + date}/${startTime}/${endTime}/`, "GET", {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname}/${URL_DASHBOARD + date}/${startTime}/${endTime}/`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
};

export const getData = (hostname, cookies, date, startTime, endTime, algorithm, camera ) => {
  console.log(date, startTime,endTime )
  let urlString = `api/reports/search_params/?date=${date}&start_time=${startTime}&end_time=${endTime}`
  if (algorithm){
    urlString += `&algorithm=${algorithm}`
  }
  if (camera && camera!== "camera"){
    urlString += `&camera__id=${camera}`
  }
  // /api/reports/search_params/?date=2023-02-22&start_time=10:30:00&end_time=18:30:00&algorithm=idle_control&camera__id=192.168.1.161
  if (getIsInternet(hostname)) {
    return proxy(`${url + urlString}`, "GET", {
      Authorization: cookies,
    });
  } else {
    return axios.get(`http://${hostname +'/'+ urlString}`, {
      headers: {
        Authorization: cookies,
      },
    });
  }
}
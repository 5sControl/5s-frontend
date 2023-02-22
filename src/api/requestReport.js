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

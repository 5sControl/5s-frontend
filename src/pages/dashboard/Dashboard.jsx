/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Dashboard.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";
import { Reports } from "../../components/reports/Reports";
import { getData } from "../../api/reportsRequest";
import { TimelineHub } from "../../components/timeline/timelineHub";
import {Preloader} from "../../components/preloader";
import { FilterForm } from "./components/filter";

function Dashboard() {
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState("7:00:00");
  const [endTime, setEndTime] = useState("19:00:00");
  const [cookies, setCookie, deleteCookie] = useCookies(["token"]);
  const [selectDate, setSelectDate] = useState(moment().format("YYYY-MM-DD"));
  
  const [cameraToResponse, setCameraToResponse] = useState("camera");
  const [algorithmToResponse, setAlgorithmToResponse] = useState("algorithm");


  const update = () => {
    getData(
      window.location.hostname,
      cookies.token,
      selectDate,
      startTime
      .split(":")
      .map((el, ind) => (ind === 0 ? el - 1 : el))
      .join(":"),
      endTime
        .split(":")
        .map((el, ind) => (ind === 0 ? el - 1 : el))
        .join(":"),
      algorithmToResponse,
      cameraToResponse
    )
      .then((el) => {
        el.data.detail === "Authentication credentials were not provided." ||
        el.data.detail === "Given token not valid for any token type"
          ? setData(0)
          : el.data.length !== data.length
          ? setData(el.data)
          : setData(data);
      })
      .catch((error) => setErrorCatch(error.message));
  };

  useEffect(() => {
    update();
  }, [selectDate, cameraToResponse, algorithmToResponse]);
  
  return (
    <>
      <div className="dashboard">
        <FilterForm
          cookies={cookies}
          setCameraToResponse = {(e) => setCameraToResponse(e)}
          cameraToResponse = {cameraToResponse}
          algorithmToResponse = {algorithmToResponse}
          setAlgorithmToResponse = {(e) => setAlgorithmToResponse(e)}
          update={update}
          endTime={endTime}
          setEndTime={(e) => setEndTime(e)}
          selectDate = {selectDate}
          setSelectDate = {(e) => setSelectDate(e)}
          setStartTime = {(e) => setStartTime(e)}
          startTime = {startTime}
        />

        {!data ? 
        <Preloader loading={true}/> :
        data.length > 0 ? (
          <>
            <TimelineHub
              data={data}
              startDate={moment(selectDate).format("YYYY-MM-DD 00:00:00")}
              endDate={moment(selectDate)
                .add(+1, "days")
                .format("YYYY-MM-DD 00:00:00")}
              startTime={startTime}
              endTime={endTime}
              
            />
            <h3>
              Reports <span>{data.length}</span>
            </h3>
            <Reports
              data={data}
            />
          </>
        ) : 
        <div className="dashboard__noreports">No reports found</div>
        }
        {errorCatch && <div className="dashboard__error">{errorCatch}</div>}
        {data === 0 && (
          <h2 className="dashboard__noauth">
            Log in to view the reports
            <Link to="/company" onClick={() => deleteCookie("token")}>
              {" "}
              Log In
            </Link>
          </h2>
        )}
      </div>
     
    </>
  );
}

export default Dashboard;

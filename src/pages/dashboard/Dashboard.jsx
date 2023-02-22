/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Dashboard.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";
import { Reports } from "../../components/reports/Reports";
import { getDashboardDate } from "../../api/requestReport";
import { TimelineHub } from "../../components/timeline/timelineHub";
import { SelectTimeDiapason } from "../../components/selectTimeDiapason";
import { DataPicker } from "../../components/dataPicker";

function Dashboard() {
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState("7:00:00");
  const [endTime, setEndTime] = useState("19:00:00");
  const [cookies, setCookie, deleteCookie] = useCookies(["token"]);
  const [currentReportMain, setCurrentReportMain] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  useEffect(() => {
    let bufStart = new Date()
    let bufEnd = new Date()

    bufStart.setHours(Number(startTime.split(':')[0]), Number(startTime.split(':')[1]), Number(startTime.split(':')[2]))
    bufEnd.setHours(Number(endTime.split(':')[0]), Number(endTime.split(':')[1]), Number(endTime.split(':')[2]))
    console.log((bufEnd - bufStart) / 1000)
  },[startTime, endTime])

  const paginator = (page) => {
    getDashboardDate(
      window.location.hostname,
      cookies.token,
      moment().format("YYYY-MM-DD")
    )
      .then((el) => {
        console.log(el);
        el.data.detail === "Authentication credentials were not provided." ||
        el.data.detail === "Given token not valid for any token type"
          ? setData(0)
          : setData(el.data);
      })
      .catch((error) => setErrorCatch(error.message));
  };

  const update = () => {
    setVisibleModal(false)
    getDashboardDate(
      window.location.hostname,
      cookies.token,
      moment().format("YYYY-MM-DD"),
      startTime.split(":").map((el, ind) => ind ===0 ? el - 1 : el ).join(":") ,
      endTime.split(":").map((el, ind) => ind ===0 ? el - 1 : el ).join(":") 
    )
      .then((el) => {
        console.log(el);
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
  console.log(currentReportMain)
},[currentReportMain])

  useEffect(() => {
    update();
    const interval = setInterval(() => {
      update();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="dashboard__title">
        <h1>Dashboard</h1>
        <div className="dashboard__title__filter">
          <button 
              onClick={()=>setVisibleModal(!visibleModal)}
              className="dashboard__title_button"
          >
            {`${startTime.split(':').slice(0,2).join(':')} - ${endTime.split(':').slice(0,2).join(':')}`}
          </button>
          <button 
              onClick={()=>setVisibleModalDate(!visibleModalDate)}
              className="dashboard__title_button"
          >
            {`${moment().format("YYYY-MM-DD")}`}
          </button>
        </div>
        
        {visibleModalDate && 
        <div className="dashboard__datapicker">
          <DataPicker/>
        </div>
        }

        {visibleModal && 
          <SelectTimeDiapason
            startTime={startTime}
            setStartTime = {(e) => setStartTime(e)}
            endTime={endTime}
            setEndTime = {(e) => setEndTime(e)}
            update = {update}
            setVisibleModal = {(e) => setVisibleModal(e)}
          />
        }
        </div>
       
        {!!data && (
          <>
            <TimelineHub
              data={data}
              startDate={moment().format("YYYY-MM-DD 00:00:00")}
              endDate={moment().add(+1, "days").format("YYYY-MM-DD 00:00:00")}
              startTime={startTime}
              endTime={endTime}
              setCurrentReportMain = {(e) => setCurrentReportMain(e)}
            />
            <h2>
              <span className="dashboard__count">{data.length}&nbsp;</span>
              <span className="dashboard__span"> reports generated today</span>
            </h2>
            <h3>Reports</h3>
            <Reports
              data={data}
              currentReportMain = {currentReportMain}
              // paginator={(e) =>paginator(e)}
            />
          </>
        )}
        {errorCatch && <div className="dashboard__error">{errorCatch}</div>}
        {data === 0 && (
          <h2 className="dashboard__noauth">
            Log in to view the reports
            <Link to="/company" onClick={()=>deleteCookie('token')}> Log In</Link>
          </h2>
        )}
      </div>
    </>
  );
}

export default Dashboard;

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

function Dashboard() {
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState("7:00:00");
  const [endTime, setEndTime] = useState("19:00:00");
  const [cookies, setCookie, deleteCookie] = useCookies(["token"]);

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
    update();
    // const interval = setInterval(() => {
    //   update();
    // }, 30000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="dashboard__title">
        <h1>Dashboard</h1>
        <div>
            start time
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              <option value="7:00:00">7:00</option>
              <option value="8:00:00">8:00</option>
              <option value="9:00:00">9:00</option>
              <option value="10:00:00">10:00</option>
              <option value="11:00:00">11:00</option>
              <option value="12:00:00">12:00</option>
              <option value="13:00:00">13:00</option>
              <option value="14:00:00">14:00</option>
              <option value="15:00:00">15:00</option>
              <option value="16:00:00">16:00</option>
              <option value="17:00:00">17:00</option>
              <option value="18:00:00">18:00</option>
              <option value="19:00:00">19:00</option>
            </select>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              <option value="7:00:00">7:00</option>
              <option value="8:00:00">8:00</option>
              <option value="9:00:00">9:00</option>
              <option value="10:00:00">10:00</option>
              <option value="11:00:00">11:00</option>
              <option value="12:00:00">12:00</option>
              <option value="13:00:00">13:00</option>
              <option value="14:00:00">14:00</option>
              <option value="15:00:00">15:00</option>
              <option value="16:00:00">16:00</option>
              <option value="17:00:00">17:00</option>
              <option value="18:00:00">18:00</option>
              <option value="19:00:00">19:00</option>
            </select>

              <button onClick={update}>Set new Time</button>
          </div>
        </div>
       
        
        {!!data && (
          <>
            <TimelineHub
              data={data}
              startDate={moment().format("YYYY-MM-DD 00:00:00")}
              endDate={moment().add(+1, "days").format("YYYY-MM-DD 00:00:00")}
              startTime={startTime}
              endTime={endTime}
            />
            <h2>
              <span className="dashboard__count">{data.length}&nbsp;</span>
              <span className="dashboard__span"> reports generated today</span>
            </h2>
            <h3>Reports</h3>
            <Reports
              data={data}
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

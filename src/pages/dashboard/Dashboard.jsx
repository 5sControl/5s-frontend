/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Dashboard.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { useCookies } from "react-cookie";

import { Link } from "react-router-dom";
import { Reports } from "../../components/reports/Reports";
import { getData } from "../../api/requestReport";
import { TimelineHub } from "../../components/timeline/timelineHub";
import { SelectTimeDiapason } from "../../components/selectTimeDiapason";
import { DataPicker } from "../../components/dataPicker";
import { getProcess } from "../../api/requests";
import { parsingAlgorithmName } from "../../functions/parsingAlgorithmName";
import {Preloader} from "../../components/preloader";

function Dashboard() {
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState("7:00:00");
  const [endTime, setEndTime] = useState("19:00:00");
  const [cookies, setCookie, deleteCookie] = useCookies(["token"]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [selectDate, setSelectDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectCameras, setSelectCameras] = useState([]);
  const [cameraToResponse, setCameraToResponse] = useState("camera");
  const [selectAlgorithm, setSelectAlgorithm] = useState([]);
  const [algorithmToResponse, setAlgorithmToResponse] = useState("algorithm");


  const update = () => {
    setVisibleModal(false);
    getData(
      window.location.hostname,
      cookies.token,
      selectDate,
      startTime
        .split(":")
        .map((el, ind) => (ind === 0 ? el - 3 : el))
        .join(":"),
      endTime
        .split(":")
        .map((el, ind) => (ind === 0 ? el - 3 : el))
        .join(":"),
      algorithmToResponse,
      cameraToResponse
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
  }, [selectDate, cameraToResponse, algorithmToResponse]);

  useEffect(() => {
    getProcess(window.location.hostname, cookies.token).then((e) => {
      if (e.data) {
        let bufCam = e.data;
        bufCam = bufCam.map((el) => el.camera);
        setSelectCameras([...new Set(bufCam)]);
        let bufAlg = e.data;
        bufAlg = bufAlg.map((el) => el.algorithm.name);
        setSelectAlgorithm([...new Set(bufAlg)]);
      }
    });
  }, []);
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__title">
          <h1>Dashboard</h1>
          <div className="dashboard__title__filter">
            <select
              value={cameraToResponse}
              onChange={(e) => setCameraToResponse(e.target.value)}
              className="dashboard__title_button"
            >
              <option value="camera">Select cameras</option>
              {selectCameras.map((el, ind) => {
                return (
                  <option value={el.id} key={ind}>
                    {el.name}
                  </option>
                );
              })}
            </select>
            <select
              value={algorithmToResponse}
              onChange={(e) => setAlgorithmToResponse(e.target.value)}
              className="dashboard__title_button"
            >
              <option value="algorithm">Select algorithm</option>
              {selectAlgorithm.map((el, ind) => {
                return (
                  <option value={el} key={ind}>
                    {parsingAlgorithmName(el)}
                  </option>
                );
              })}
            </select>
            <span className="dashboard__title_button">Sort: Newest</span>
            <button
              onClick={() => setVisibleModal(!visibleModal)}
              className="dashboard__title_button"
            >
              {`${startTime.split(":").slice(0, 2).join(":")} - ${endTime
                .split(":")
                .slice(0, 2)
                .join(":")}`}
            </button>
            <button
              onClick={() => setVisibleModalDate(!visibleModalDate)}
              className="dashboard__title_button"
            >
              {`${selectDate}`}
            </button>
          </div>

          {visibleModalDate && (
            <div className="dashboard__datapicker">
              <DataPicker
                setSelectDate={(e) => setSelectDate(e)}
                update={update}
                setVisibleModalDate={(e) => setVisibleModalDate(e)}
                selectDateDash={selectDate}
              />
            </div>
          )}

          {visibleModal && (
            <SelectTimeDiapason
              startTime={startTime}
              setStartTime={(e) => setStartTime(e)}
              endTime={endTime}
              setEndTime={(e) => setEndTime(e)}
              update={update}
              setVisibleModal={(e) => setVisibleModal(e)}
            />
          )}
        </div>

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
        <>No reports</>
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

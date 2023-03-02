/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getData } from "../../api/reportsRequest";
import { Reports } from "../../components/reports/Reports";
import { DataPicker } from "../../components/dataPicker";
import { SelectTimeDiapason } from "../../components/selectTimeDiapason";
import moment from "moment";

import { Back } from "../../assets/svg/SVGcomponent";
import { TimelineHub } from "../../components/timeline/timelineHub";
import { getProcess } from "../../api/requests";

import "./reportPage.scss";

export const ReportPage = ({control}) => {
  const navigate = useNavigate();
  const url = window.location.pathname;
  const [data, setData] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState("7:00:00");
  const [endTime, setEndTime] = useState("19:00:00");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [selectDate, setSelectDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectCameras, setSelectCameras] = useState([]);
  const [cameraToResponse, setCameraToResponse] = useState("camera");
  const [algorithmToResponse, setAlgorithmToResponse] = useState(
    window.location.pathname.substring(1)
  );

  const updateFromDB = () => {
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
   
      getProcess(window.location.hostname, cookies.token).then((e) => {
        if (e.data) {
          let bufCam = e.data;
          console.log(bufCam)
          bufCam = bufCam.filter((el) => el.algorithm.name === control).map((el) => el.camera);
          
          setSelectCameras([...new Set(bufCam)]);
        }
      });
  }, []);

  useEffect(() => {
    updateFromDB();
  },[cameraToResponse, selectDate])
  return (
    <>
      {!!data && (
        <div className="dashboard">
          <div className="dashboard__title">
            <div>
              <Back className="back-button" onClick={() => navigate(-1)} />
              <span className="dashboard__title_h1">
                {url.includes("safety")
                  ? "Safety Control: Ear protection".toUpperCase()
                  : url.includes("idle")
                  ? "Idle Control".toUpperCase()
                  : url.includes("machine")
                  ? "Machine Control".toUpperCase()
                  : ""}
              </span>
            </div>
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
                className="dashboard__title_button"
                onChange={() => console.log()}
              >
                <option value="algorithm">{algorithmToResponse}</option>
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
          </div>

          {!!data && data.length > 0 ? (
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
          ) : (
            <>No reports</>
          )}
          {visibleModalDate && (
            <div className="dashboard__datapicker">
              <DataPicker
                setSelectDate={(e) => setSelectDate(e)}
                update={updateFromDB}
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
              update={updateFromDB}
              setVisibleModal={(e) => setVisibleModal(e)}
            />
          )}
          {errorCatch && <div className="dashboard__error">{errorCatch}</div>}
        </div>
      )}
    </>
  );
};

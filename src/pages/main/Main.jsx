/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./main.scss";
import logo from "../../assets/svg/icon.svg";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";
import { AlgorithmList } from "../../components/algorithmList";
import { CameraSelect } from "../../components/cameraChoise";
import { Cameras } from "../../components/cameras/cameras";
import {
  getAveilableAlgorithms,
  postAlgorithnDependences,
} from "../../api/requests";
import { getSelectedCameras } from "../../api/requestHomeAndOffice";

export const Main = () => {
  const [
    camerasSafety_Control_Ear_protection,
    setCamerasSafety_Control_Ear_protection,
  ] = useState([]);
  const [camerasIdle_control, setCamerasIdle_control] = useState([]);
  const [camerasMachine_Control, setCamerasMachine_Control] = useState([]);
  const [stage, setStage] = useState("begin");
  const [selectType, setSelectType] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const [algorithmList, setAlgorithmList] = useState({});
  const [showAfterRegistration, setShowAfterRegistration] = useState(false);
  const navigate = useNavigate();

  const reducer = () => {
    return (
      camerasIdle_control.filter((el) => el.isSelected).map((e) => e.ip)
        .length +
      camerasSafety_Control_Ear_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length +
      camerasMachine_Control.filter((el) => el.isSelected).map((e) => e.ip)
        .length
    );
  };

  const [algorithmCount, setAlgorithmCount] = useState(reducer());

  useEffect(() => {
    setAlgorithmCount(reducer());
  });

  const continueHandler = () => {
    let response = {
      server_url: window.location.hostname.includes("localhost")
        ? `http://192.168.1.101`
        : `http://${window.location.hostname}`,
    };

    if (
      camerasSafety_Control_Ear_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length > 0
    ) {
      response.safety_control_ear_protection =
        camerasSafety_Control_Ear_protection
          .filter((el) => el.isSelected)
          .map((e) => e.ip);
    }
    if (
      camerasMachine_Control.filter((el) => el.isSelected).map((e) => e.ip)
        .length > 0
    ) {
      response.machine_control = camerasMachine_Control
        .filter((el) => el.isSelected)
        .map((e) => e.ip);
    }
    if (
      camerasIdle_control.filter((el) => el.isSelected).map((e) => e.ip)
        .length > 0
    ) {
      response.idle_control = camerasIdle_control
        .filter((el) => el.isSelected)
        .map((e) => e.ip);
    }

    postAlgorithnDependences(
      window.location.hostname,
      cookies.token,
      response
    ).then((e) => {
      if (e.data.message === "Camera Algorithm records created successfully") {
        setShowAfterRegistration(e.data.message);
        localStorage.setItem("registration", "true");
      }
    });
  };

  const doneHandler = () => {
    if (selectType.type === "Safety_Control_Ear_protection") {
      setCamerasSafety_Control_Ear_protection(selectType.obj);
    }
    if (selectType.type === "Machine_Control") {
      setCamerasMachine_Control(selectType.obj);
    }
    if (selectType.type === "Idle_Control") {
      console.log(selectType.obj);
      setCamerasIdle_control(selectType.obj);
    }
    setSelectType("");
  };

  useEffect(() => {
    if (stage === "algorithm") {
      getSelectedCameras(window.location.hostname, cookies.token).then(
        (response) => {
          let buf = response.data.map((el, ind) => {
            return {
              id: ind + 1,
              isSelected: false,
              ip: el.id,
              name: el.name,
            };
          });
          setCamerasSafety_Control_Ear_protection(buf);
          setCamerasIdle_control(buf);
          setCamerasMachine_Control(buf);
        }
      );
    }
  }, [stage]);

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, cookies.token).then(
      (res) => {
        setAlgorithmList(res.data);
      }
    );
  }, []);

  const onChangeHandler = (id) => {
    setSelectType({
      obj: selectType.obj.map((el) =>
        el.id === id ? { ...el, isSelected: !el.isSelected } : el
      ),
      type: selectType.type,
    });
  };

  return (
    <>
      {/* {localStorage.getItem('registration') === 'true' ? 
            <div className='showAfterRegistration'>
                <div className='showAfterRegistration__container'>
                    <h4>You alredy registrated</h4>
                    <button className='showAfterRegistration__button' onClick={() => navigate('/dashboard')}>Dashboard</button>
                </div>
            </div>
        : */}
      <>
        {stage === "begin" && (
          <div className="main">
            <img src={logo} alt="logo" className="main__logo" />
            <span className="main__span">
              Congratulations! <br />
              You have successfully installed the 5S Control’s Docker and now
              ready to use it. Complete the setup to start.
            </span>
            <button className="main__start" onClick={() => setStage("cameras")}>
              Start Setup
            </button>
          </div>
        )}
        {stage === "cameras" && <Cameras />}
        {stage === "algorithm" && (
          <AlgorithmList
            algorithmList={algorithmList}
            algorithmCount={algorithmCount}
            setSelectType={(e) => {
              setSelectType(e);
            }}
            camerasSafety_Control_Ear_protection={
              camerasSafety_Control_Ear_protection
            }
            camerasMachine_Control={camerasMachine_Control}
            camerasIdle_Control={camerasIdle_control}
            algorithmPage={"main"}
          />
        )}
        <div className={stage !== "begin" ? "visible" : "novisible"}>
          {stage === "cameras" && (
            <button
              // className={algorithmCount > 5 ? "noclick" : ""}
              onClick={() => setStage("algorithm")}
            >
              Continue
            </button>
          )}
          {stage === "algorithm" && (
            <button
              // className={algorithmCount > 5 ? "noclick" : ""}
              onClick={continueHandler}
            >
              Continue
            </button>
          )}
        </div>
        {selectType !== "" && (
          <CameraSelect
            selectType={selectType}
            onChangeHandler={(e) => onChangeHandler(e)}
            setSelectType={(e) => setSelectType(e)}
            doneHandler={doneHandler}
          />
        )}
        {showAfterRegistration && (
          <div className="showAfterRegistration">
            <div className="showAfterRegistration__container">
              <h4>{showAfterRegistration}</h4>
              <button
                className="showAfterRegistration__button"
                onClick={() => navigate("/dashboard")}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
};

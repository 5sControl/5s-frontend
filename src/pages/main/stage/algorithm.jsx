/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { getSelectedCameras } from "../../../api/cameraRequest";

import {
  postAlgorithnDependences,
  getAveilableAlgorithms,
} from "../../../api/algorithmRequest";
import { AlgorithmList } from "../../../components/algorithmList";
import { CameraSelect } from "../components/cameraChoise";

export const AlogorithmStage = ({ token, setShowAfterRegistration }) => {

  const [selectType, setSelectType] = useState("");
  const [algorithmCount, setAlgorithmCount] = useState(0);
  const [algorithmList, setAlgorithmList] = useState({});

  const [ camerasSafety_Control_Ear_protection, setCamerasSafety_Control_Ear_protection] = useState([]);
  const [ camerasSafety_Control_Reflective_jacket,setCamerasSafety_Control_Reflective_jacket] = useState([]);
  const [ camerasSafety_Control_Head_protection, setCamerasSafety_Control_Head_protection] = useState([]);
  const [ camerasSafety_Control_Hand_protection, setCamerasSafety_Control_Hand_protection ] = useState([]);
  const [camerasIdle_control, setCamerasIdle_control] = useState([]);
  const [camerasStaff_control, setCamerasStaff_control] = useState([]);
  const [camerasMachine_Control, setCamerasMachine_Control] = useState([]);

  const doneHandler = () => {
    if (selectType.type === "Safety_Control_Ear_protection") {
      setCamerasSafety_Control_Ear_protection(selectType.obj);
    }
    if (selectType.type === "Safety_control_reflective_jacket") {
      setCamerasSafety_Control_Reflective_jacket(selectType.obj);
    }
    if (selectType.type === "Safety_control_head_protection") {
      setCamerasSafety_Control_Head_protection(selectType.obj);
    }
    if (selectType.type === "Safety_control_hand_protection") {
      setCamerasSafety_Control_Hand_protection(selectType.obj);
    }
    if (selectType.type === "Machine_Control") {
      setCamerasMachine_Control(selectType.obj);
    }
    if (selectType.type === "Idle_Control") {
      setCamerasIdle_control(selectType.obj);
    }
    if (selectType.type === "Staff_Control") {
      setCamerasStaff_control(selectType.obj);
    }
    setSelectType("");
  };


  useEffect(() => {
    getSelectedCameras(window.location.hostname, token).then((response) => {
      let buf = response.data.map((el, ind) => {
        return {
          id: ind + 1,
          isSelected: false,
          ip: el.id,
          name: el.name,
        };
      });
      setCamerasSafety_Control_Ear_protection(buf);
      setCamerasSafety_Control_Reflective_jacket(buf);
      setCamerasIdle_control(buf);
      setCamerasStaff_control(buf);
      setCamerasMachine_Control(buf);
      setCamerasSafety_Control_Head_protection(buf);
      setCamerasSafety_Control_Hand_protection(buf);
    });
  }, []);

  useEffect(() => {
    setAlgorithmCount(reducer());
  });

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      setAlgorithmList(res.data);
    });
  }, []);

  const saveSettings = () => {
    let response = {
      server_url: window.location.hostname.includes("localhost")
        ? `http://192.168.1.101`
        : `http://${window.location.hostname}`,
    };

    if (camerasSafety_Control_Ear_protection.filter((el) => el.isSelected).map((e) => e.ip).length > 0) {
      response.safety_control_ear_protection =
        camerasSafety_Control_Ear_protection
          .filter((el) => el.isSelected)
          .map((e) => e.ip);
    }
    if (
      camerasSafety_Control_Reflective_jacket
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length > 0
    ) {
      response.safety_control_reflective_jacket =
      camerasSafety_Control_Reflective_jacket
          .filter((el) => el.isSelected)
          .map((e) => e.ip);
    }
    if (
      camerasSafety_Control_Head_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length > 0
    ) {
      response.safety_control_head_protection =
      camerasSafety_Control_Head_protection
          .filter((el) => el.isSelected)
          .map((e) => e.ip);
    }
    if (
      camerasSafety_Control_Hand_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length > 0
    ) {
      response.safety_control_hand_protection =
      camerasSafety_Control_Hand_protection
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

    if (
      camerasStaff_control.filter((el) => el.isSelected).map((e) => e.ip)
        .length > 0
    ) {
      response.staff_control = camerasStaff_control
        .filter((el) => el.isSelected)
        .map((e) => e.ip);
    }

    postAlgorithnDependences(
      window.location.hostname,
      token,
      response
    ).then((e) => {
      if (e.data.message === "Camera Algorithm records created successfully") {
        setShowAfterRegistration(e.data.message);
        localStorage.setItem("registration", "true");
      }
    });
  };

  function reducer() {
    return  camerasIdle_control.filter((el) => el.isSelected).map((e) => e.ip)
        .length +
      camerasStaff_control.filter((el) => el.isSelected).map((e) => e.ip)
        .length +
      camerasSafety_Control_Ear_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length +
      camerasMachine_Control.filter((el) => el.isSelected).map((e) => e.ip)
        .length +
      camerasSafety_Control_Reflective_jacket
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length +
      camerasSafety_Control_Head_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length +
      camerasSafety_Control_Hand_protection
        .filter((el) => el.isSelected)
        .map((e) => e.ip).length
  };

  return (
    <>
      <AlgorithmList
        algorithmList={algorithmList}
        algorithmCount={algorithmCount}
        setSelectType={(e) => {
          setSelectType(e);
        }}
        camerasSafety_Control_Ear_protection={ camerasSafety_Control_Ear_protection}
        camerasSafety_Control_Reflective_jacket={camerasSafety_Control_Reflective_jacket}
        camerasSafety_Control_Head_protection={camerasSafety_Control_Head_protection}
        camerasSafety_Control_Hand_protection={camerasSafety_Control_Hand_protection}
        camerasMachine_Control={camerasMachine_Control}
        camerasIdle_Control={camerasIdle_control}
        camerasStaff_control={camerasStaff_control}
        algorithmPage={"main"}
      />
      {selectType !== "" && 
        <CameraSelect
          selectType={selectType}
          setSelectType={(e) => setSelectType(e)}
          doneHandler={doneHandler}
        />
      }
      <div className={"visible"}>
        <button
          // className={algorithmCount > 5 ? "noclick" : ""}
          onClick={saveSettings}
        >
          Continue
        </button>
      </div>
    </>
  );
};

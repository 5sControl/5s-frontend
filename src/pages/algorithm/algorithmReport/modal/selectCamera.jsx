/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import { url, getIsInternet } from "../../../../api/api";
import { getSelectedCameras } from "../../../../api/cameraRequest";
import { useState } from "react";
import {
  deleteProcess,
  postAlgorithnDependences,
} from "../../../../api/algorithmRequest";
import close from "../../../../assets/svg/close.svg";
export const CameraModal = ({
  token,
  activeCameras,
  setShowModal,
  fullInfoProcess,
  control,
  setCamera,
}) => {
  const [allCameras, setAllCameras] = useState([]);
  const [previousNonActiveCameras, setPreviousMonActiveCameras] = useState([]);
  const ProccessIDInObject = fullInfoProcess.reduce((acc, obj) => {
    const key = obj.camera.id;
    const curGroup = acc[key] ?? [];
    return { ...acc, [key]: [...curGroup, obj.process_id] };
  }, {});

  const deleteProcessFromDB = async (whatIsDelete) => {
    for (const processID of whatIsDelete) {
      await deleteProcess(window.location.hostname, token, processID).then(
        (e) => {
          console.log("delete");
        }
      );
    }
    return;
  };

  const updateCamerasState = async () => {
    let afterSelectedCameras = allCameras.reduce((acc, obj) => {
      const key = obj.isSelected;
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj.id] };
    }, {});
    let whatIsDelete = afterSelectedCameras.false
      ? afterSelectedCameras.false.filter((activeCamera) =>
          activeCameras.includes(activeCamera)
        )
      : [];
    whatIsDelete = whatIsDelete?.map(
      (IPcamera) => ProccessIDInObject[IPcamera][0]
    );
    const whatIsAdd = afterSelectedCameras.true?.filter((activeCamera) =>
      previousNonActiveCameras.includes(activeCamera)
    );
    await deleteProcessFromDB(whatIsDelete);
    await postAlgorithnDependences(window.location.hostname, token, {
      server_url: window.location.hostname.includes("localhost")
        ? `http://192.168.1.101`
        : `http://${window.location.hostname}`,
      [control]: whatIsAdd,
    }).then((e) => {
      if (e.data.message === "Camera Algorithm records created successfully") {
        console.log("its ok add");
      }
    });
    await setShowModal();
  };

  useEffect(() => {
    getSelectedCameras(window.location.hostname, token).then((response) => {
      setAllCameras(
        response.data.map((item) => {
          return {
            ...item,
            isSelected: activeCameras.includes(item.id),
          };
        })
      );
      setPreviousMonActiveCameras(
        response.data
          .map((item) => item.id)
          .filter((cameraID) => !activeCameras.includes(cameraID))
      );
    });
  }, []);

  return (
    <section className="camera-modal">
      <div className="camera-modal__container">
        <h1>
          {" "}
          Choise the Camera{" "}
          <img src={close} alt="Close" onClick={setShowModal} />
        </h1>
        <div className="camera-modal__content">
          {allCameras.map((el, index) => (
            <Fragment key={index}>
              <div className={"select__cameras_item"}>
                <img
                  src={
                    getIsInternet(window.location.hostname)
                      ? `${url}/images/${el.id}/snapshot.jpg`
                      : `http://${window.location.hostname}/images/${el.id}/snapshot.jpg`
                  }
                  alt="Camera"
                />
                <div className="select__cameras_item_footer">
                  <span>{el.name}</span>
                  <input
                    type="checkbox"
                    checked={el.isSelected}
                    onChange={() =>
                      setAllCameras(
                        [
                          ...allCameras,
                          (allCameras[index].isSelected =
                            !allCameras[index].isSelected),
                        ].slice(0, -1)
                      )
                    }
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="select__buttons">
          <button className="select__buttons_cancel" onClick={setShowModal}>
            Cancel
          </button>
          <button className="select__buttons_done" onClick={updateCamerasState}>
            Done
          </button>
        </div>
      </div>
    </section>
  );
};

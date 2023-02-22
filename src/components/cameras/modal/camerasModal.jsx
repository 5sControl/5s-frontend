import { useState } from "react";
import { Close } from "../../../assets/svg/SVGcomponent";
import { AiOutlineRight } from "react-icons/ai";
import { patchCamera, postCamera } from "../../../api/requestHomeAndOffice";
import { getIsInternet } from "../../../api/getURL";
import { API_IMAGES_I } from "../../../api/api";
export const CamerasModal = ({
  setIsShowModal,
  cookies,
  camerasList,
  setCamerasList,
}) => {
  const [stage, setStage] = useState("selectCamera");
  const [IPCamera, setIPCamera] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [connectMessage, setConnectMessage] = useState("");
  const [cameraName, setCameraName] = useState("");

  const changeCameraName = () => {
    setIsShowModal(false);
    setStage("selectCamera");
    setCamerasList(IPCamera);
    patchCamera(window.location.hostname, IPCamera, cameraName, cookies.token).then((res) =>
      console.log(res)
    );
  };

  const connect = () => {
    postCamera(
      window.location.hostname,
      IPCamera,
      username,
      password,
      cookies.token
    ).then((e) => {
      if (e.data.message && e.data.message.includes("failed")) {
        console.log(e.data.message);
        setConnectMessage(e.data.message);
      } else {
        setStage("cameraCreated");
      }
    });
  };

  return (
    <div className="cameras__modal">
      <div className="cameras__modal__container">
        {stage === "selectCamera" && camerasList.length > 0 && (
          <>
            <div className="cameras__modal__title">
              <h2>Select a camera from your local network</h2>
              <Close
                onClick={() => setIsShowModal(false)}
                className="cameras__modal__title_close"
              />
            </div>
            <div className="cameras__modal__list">
              {camerasList.map((el, ind) => (
                <div
                  key={ind}
                  className="cameras__modal__list_item"
                  onClick={() => {
                    setStage("logAndPass");
                    setIPCamera(el);
                  }}
                >
                  <span>{el}</span>
                  <AiOutlineRight />
                </div>
              ))}
            </div>
          </>
        )}
        {stage === "logAndPass" && (
          <>
            <div className="cameras__modal__title">
              <h2>{IPCamera}</h2>
              <Close
                onClick={() => setIsShowModal(false)}
                className="cameras__modal__title_close"
              />
            </div>
            <div className="cameras__modal__login">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setConnectMessage("")}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setConnectMessage("")}
              />
              <div style={{ color: "red" }}>{connectMessage}</div>
              <div className="cameras__modal__login__footer">
                <button
                  className="cameras__modal__login__cancel"
                  onClick={() => setStage("selectCamera")}
                >
                  Cancel
                </button>
                <button
                  className="cameras__modal__login__create"
                  onClick={connect}
                >
                  Connect
                </button>
              </div>
            </div>
          </>
        )}
        {stage === "cameraCreated" && (
          <>
            <div className="cameras__modal__showCamera">
              <img
                src={
                  getIsInternet(window.location.hostname)
                    ? `${API_IMAGES_I}/images/${IPCamera}/snapshot.jpg`
                    : `http://${window.location.hostname}/images/${IPCamera}/snapshot.jpg`
                }
                alt="Camera"
              />
              <input
                type="text"
                value={cameraName}
                onChange={(e) => setCameraName(e.target.value)}
              />
              <div className="cameras__modal__login__footer">
                <button
                  className="cameras__modal__login__create"
                  onClick={changeCameraName}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

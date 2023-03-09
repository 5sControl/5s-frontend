import { useState } from 'react';
import { url, getIsInternet } from '../../../../../api/api';
import { patchCamera } from '../../../../../api/cameraRequest';
import { Close } from '../../../../../assets/svg/SVGcomponent';
export const CameraSettings = ({ IPCamera, token, setIsCameraSettings }) => {
  const [cameraName, setCameraName] = useState('');

  const applySettings = () => {
    patchCamera(window.location.hostname, IPCamera, cameraName, token).then((res) => {
      console.log(res);
      setIsCameraSettings(false);
    });
  };

  return (
    <>
      <section className="cameras__settings">
        <div className="cameras__settings_modal">
          <div className="cameras__settings_header">
            <h1>Camera Settings</h1>
            <Close onClick={() => setIsCameraSettings(false)} />
          </div>
          <p className="cameras__settings_desc">
            Successfully connected. Give camera a name that will be used in 5S Control system and
            select algorithms that will be used on it.
          </p>
          <div className="cameras__settings_container">
            <div className="cameras__settings_left">
              <div className="cameras__settings_camera">
                <div className="cameras__settings_inputs">
                  <label htmlFor="cameraName">Camera Name</label>
                  <input
                    type="text"
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                  />
                  <label htmlFor="cameraName">Controlled workplace</label>
                  <input type="text" />
                </div>
                <input type="checkbox" value={true} />
                <label> Save recordings from this camera.</label>
              </div>
            </div>
            <div className="cameras__settings_right">
              <img
                src={
                  getIsInternet(window.location.hostname)
                    ? `${url}/images/${IPCamera}/snapshot.jpg`
                    : `http://${window.location.hostname}/images/${IPCamera}/snapshot.jpg`
                }
                alt="Camera"
                className="cameras__settings_img"
              />
            </div>
          </div>
          <div className="">
            <button className="" onClick={applySettings}>
              Done
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

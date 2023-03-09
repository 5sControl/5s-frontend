import { useState } from 'react';
import { url, getIsInternet } from '../../../../../api/api';
import { patchCamera } from '../../../../../api/cameraRequest';
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
        <div className="cameras__settings_container">
          <img
            src={
              getIsInternet(window.location.hostname)
                ? `${url}/images/${IPCamera}/snapshot.jpg`
                : `http://${window.location.hostname}/images/${IPCamera}/snapshot.jpg`
            }
            alt="Camera"
            className="cameras__settings_img"
          />
          <input type="text" value={cameraName} onChange={(e) => setCameraName(e.target.value)} />
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

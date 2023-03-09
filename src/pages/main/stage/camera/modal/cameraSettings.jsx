import { useEffect, useState } from 'react';
import { url, getIsInternet } from '../../../../../api/api';
import { patchCamera } from '../../../../../api/cameraRequest';
import { Close } from '../../../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from './components/algorithmSelect';
import { getProcess } from '../../../../../api/algorithmRequest';
export const CameraSettings = ({ IPCamera, token, setIsCameraSettings, nameCamera }) => {
  const [cameraName, setCameraName] = useState(nameCamera);
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);

  const applySettings = () => {
    patchCamera(window.location.hostname, IPCamera, cameraName, token).then((res) => {
      console.log(res);
      setIsCameraSettings(false);
    });
  };

  useEffect(() => {
    getProcess(window.location.hostname, token).then((response) => {
      let bufObject = response.data?.map((item) => {
        return {
          [item.algorithm.name]: item.camera.id,
        };
      });
      bufObject = bufObject.reduce((acc, obj) => {
        const key = obj[Object.keys(obj)[0]];
        const curGroup = acc[key] ?? [];

        return { ...acc, [key]: [...curGroup, Object.keys(obj)[0]] };
      }, {});
      setAlgorithmsActiveObject(bufObject);
    });
  }, []);

  return (
    <>
      {algorithmsActiveObject && (
        <>
          <section className="cameras__settings">
            <div className="cameras__settings_modal">
              <div className="cameras__settings_header">
                <h1>Camera Settings</h1>
                <Close onClick={() => setIsCameraSettings(false)} />
              </div>
              <p className="cameras__settings_desc">
                Successfully connected. Give camera a name that will be used in 5S Control system
                and select algorithms that will be used on it.
              </p>
              <div className="cameras__settings_container">
                <div className="cameras__settings_left">
                  <div className="cameras__settings_camera">
                    <div className="cameras__settings_inputs">
                      <div>
                        <label htmlFor="cameraName">Camera Name</label>
                        <input
                          type="text"
                          value={cameraName}
                          onChange={(e) => setCameraName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="cameraName">Controlled workplace</label>
                        <input type="text" />
                      </div>
                    </div>
                    <label>
                      <input type="checkbox" name="isRecording" value={true} />
                      &nbsp; Save recordings from this camera.
                    </label>
                  </div>
                  <AlgorithmSelect
                    token={token}
                    algorithmsActive={algorithmsActiveObject[IPCamera]}
                  />
                  {console.log(algorithmsActiveObject[IPCamera])}
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
      )}
    </>
  );
};

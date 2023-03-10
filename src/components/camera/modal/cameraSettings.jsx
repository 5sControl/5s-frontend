import { useEffect, useState } from 'react';
import { url, getIsInternet } from '../../../api/api';
import { patchCamera } from '../../../api/cameraRequest';
import { Close } from '../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from './components/algorithmSelect';
import { deleteProcess, getProcess, postAlgorithnDependences } from '../../../api/algorithmRequest';

export const CameraSettings = ({ IPCamera, token, setIsCameraSettings, nameCamera }) => {
  const [cameraName, setCameraName] = useState(nameCamera);
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);
  const [process, setProcess] = useState([]);
  const [informationToSend, setInformationToSend] = useState({});
  const [isEnabled, setIsEnabled] = useState(true);
  const deleteProcessFromDB = async (whatIsDelete) => {
    for (const processID of whatIsDelete) {
      await deleteProcess(window.location.hostname, token, processID).then(() => {
        console.log('delete');
      });
    }
    return;
  };

  const addProcessToDB = async (whatIsAdd) => {
    // console.log(whatIsAdd);
    for (const algorithm of whatIsAdd) {
      let response = {
        server_url: window.location.hostname.includes('localhost')
          ? 'http://192.168.1.101'
          : `http://${window.location.hostname}`,
        [algorithm]: [IPCamera],
      };
      await postAlgorithnDependences(window.location.hostname, token, response).then(() => {
        // console.log(e);
      });
    }
    return;
  };

  const applySettings = async () => {
    setIsEnabled(false);
    if (cameraName !== nameCamera) {
      await patchCamera(window.location.hostname, IPCamera, cameraName, token).then(() => {
        // console.log(res);
      });
    }
    if (informationToSend.delete && informationToSend.delete.length > 0) {
      await deleteProcessFromDB(informationToSend.delete);
    }
    if (informationToSend.add && informationToSend.add.length > 0) {
      await addProcessToDB(informationToSend.add);
    }
    await setIsCameraSettings(false);
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
      setProcess(response.data);
      setAlgorithmsActiveObject(bufObject);
    });
  }, []);

  useEffect(() => {
    // console.log(informationToSend);
  }, [informationToSend]);
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
                    algorithmsActive={
                      algorithmsActiveObject[IPCamera] ? algorithmsActiveObject[IPCamera] : []
                    }
                    process={process}
                    IPCamera={IPCamera}
                    setInformationToSend={(e) => setInformationToSend(e)}
                  />
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
              <button disabled={!isEnabled} className="cameras__button" onClick={applySettings}>
                Done
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
};

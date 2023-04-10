import { useEffect, useState } from 'react';
import { patchCamera } from '../../../api/cameraRequest';
import { Close } from '../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from './components/algorithmSelect';
import {
  deleteOperationID,
  deleteProcess,
  getOperationID,
  getProcess,
  postAlgorithnDependences,
  postOperationID,
} from '../../../api/algorithmRequest';

export const CameraSettings = ({ IPCamera, token, setIsCameraSettings, nameCamera }) => {
  const [cameraName, setCameraName] = useState(nameCamera);
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);
  const [processLocal, setProcess] = useState([]);
  const [informationToSend, setInformationToSend] = useState({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [operationID, setOperationID] = useState('');
  const [currentOperation, setCurrentOperation] = useState({});

  const deleteProcessFromDB = async (whatIsDelete) => {
    for (const processID of whatIsDelete) {
      await deleteProcess(window.location.hostname, token, processID.process_id).then(() => {
        console.log('delete');
      });
    }
    console.log(whatIsDelete);
    return;
  };

  const addProcessToDB = async (whatIsAdd) => {
    for (const algorithm of whatIsAdd) {
      let response = {
        server_url: window.location.hostname.includes('localhost')
          ? 'http://192.168.1.110'
          : `http://${window.location.hostname}`,
        [algorithm]: [IPCamera],
      };
      await postAlgorithnDependences(window.location.hostname, token, response).then(() => {
        // console.log(e);
      });

      if (whatIsAdd.includes('operation_control')) {
        console.log('operation_control');
        await postOperationID(window.location.hostname, token, {
          type_operation: operationID,
          camera: IPCamera,
        }).then((e) => {
          console.log(e);
        });
      }
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
    console.log(informationToSend);
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
      getOperationID(window.location.hostname, token).then((response) => {
        console.log(response.data.results);
        console.log(bufObject);
        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0 &&
          bufObject[IPCamera].includes('operation_control')
        ) {
          const currentOper = response.data.results.filter((item) => item.camera === IPCamera)[
            response.data.results.length - 1
          ];
          setOperationID(currentOper.type_operation || '');
          setCurrentOperation(currentOper);
        } else {
          setOperationID('');
        }
      });
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
                <Close onClick={() => setIsCameraSettings(false)} className="pointer" />
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
                    process={processLocal}
                    IPCamera={IPCamera}
                    setInformationToSend={(e) => setInformationToSend(e)}
                    operationID={operationID}
                    setOperationID={(id) => setOperationID(id)}
                  />
                </div>
                <div className="cameras__settings_right">
                  <img
                    src={
                      process.env.REACT_APP_ENV === 'proxy'
                        ? `${process.env.REACT_APP_NGROK}/images/${IPCamera}/snapshot.jpg`
                        : process.env.REACT_APP_ENV === 'wify'
                        ? `${process.env.REACT_APP_IP_SERVER}images/${IPCamera}/snapshot.jpg`
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

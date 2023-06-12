import { useEffect, useState } from 'react';
import { AlgorithmSelect } from './algorithms/algorithmSelect';
import {
  getOperationID,
  getProcess,
  postAlgorithnDependences,
} from '../../../api/algorithmRequest';
import { findCamera } from '../../../api/cameraRequest';
import { Preloader } from '../../../components/preloader';
import { Notification } from '../../../components/notification/notification';
import { Tabs } from './tabs/tabs';
import { Camera } from './camera/camera';
import { Zones } from './zones/zones';

export const SettingsHub = ({
  cameraSelect,
  token,
  setIsCameraSettings,
  isCreateCamera,
  camerasList,
  setIsNotificationAfterCreate,
}) => {
  const [cameraName, setCameraName] = useState(cameraSelect.name ? cameraSelect.name : '');
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);
  const [processLocal, setProcess] = useState([]);
  const [informationToSend, setInformationToSend] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [operationID, setOperationID] = useState('');
  const [findCameraList, setFindCameraList] = useState(false);
  const [cameraIP, setCameraIP] = useState(cameraSelect.id ? cameraSelect.id : '');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isNotification, setIsNotification] = useState(false);
  const [isPreloader, setIsPreloader] = useState(false);
  const [activeTab, setActiveTab] = useState('Camera');
  const [configAlgo, setConfigAlgo] = useState({});

  const applySettings = async () => {
    setIsPreloader(true);
    const response = {
      camera: {
        ip: cameraIP,
        name: cameraName.length > 0 ? cameraName : cameraIP,
        username: userName,
        password: password,
      },
      algorithms: [],
    };

    for (const algorithm of informationToSend) {
      if (algorithm === 'operation_control') {
        response.algorithms = [
          ...response.algorithms,
          {
            name: algorithm,
            config: {
              operation_control_id: operationID,
            },
          },
        ];
      } else {
        response.algorithms = [
          ...response.algorithms,
          {
            name: algorithm,
            config: {
              zonesID: [configAlgo[algorithm].map((e) => ({ id: e }))],
            },
          },
        ];
      }
    }
    console.log(response);
    await postAlgorithnDependences(window.location.hostname, token, response)
      .then(() => {
        setIsEnabled(false);
        setIsNotificationAfterCreate();
        setIsCameraSettings(false);
        setIsPreloader(false);
      })
      .catch((error) => {
        console.log(error);
        setIsNotification(true);
        setIsPreloader(false);
      });
  };

  useEffect(() => {
    if (!isCreateCamera) {
      setCameraName(cameraSelect.name);
      setUserName(cameraSelect.username);
      setPassword(cameraSelect.password);
    }

    getProcess(window.location.hostname, token)
      .then((response) => {
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
          if (
            response.data &&
            response.data.results &&
            response.data.results.length > 0 &&
            bufObject[cameraSelect.id] &&
            bufObject[cameraSelect.id].includes('operation_control')
          ) {
            const currentOper = response.data.results.filter(
              (item) => item.camera === cameraSelect.id
            );
            if (currentOper.length > 0) {
              setOperationID(currentOper[currentOper.length - 1].type_operation || '');
            } else {
              setOperationID('');
            }
          } else {
            setOperationID('');
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    findCamera(window.location.hostname)
      .then((response) => {
        if (response.data && response.data.results) {
          const allCameras = response.data.results;
          const bufCreatedCameras = camerasList.length > 0 ? camerasList.map((e) => e.id) : [];
          const resultCameras = allCameras.filter((value) => {
            return !bufCreatedCameras.includes(value);
          });
          setFindCameraList(resultCameras);
        } else {
          setFindCameraList([]);
        }
      })
      .catch((error) => console.log(error.message));
  }, []);

  return (
    <>
      {algorithmsActiveObject && findCameraList ? (
        <>
          <div className="cameras__settings_container">
            <section className="cameras__settings">
              <div className="cameras__settings_modal">
                <div className="cameras__settings_header">
                  <h1>Camera Settings</h1>
                  <Tabs activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} />
                </div>
                {activeTab === 'Camera' && (
                  <Camera
                    cameraIP={cameraIP}
                    isCreateCamera={isCreateCamera}
                    cameraSelect={cameraSelect}
                    findCameraList={findCameraList}
                    setCameraIP={(ip) => setCameraIP(ip)}
                    userName={userName}
                    password={password}
                    applySettings={applySettings}
                    isEnabled={isEnabled}
                    cameraName={cameraName}
                    setUserName={(name) => setUserName(name)}
                    setPassword={(password) => setPassword(password)}
                    setCameraName={(name) => setCameraName(name)}
                  />
                )}
                {activeTab === 'Zones' && (
                  <Zones cameraSelect={cameraSelect} isCreateCamera={isCreateCamera} />
                )}
                {activeTab === 'Algorithms' && (
                  <AlgorithmSelect
                    token={token}
                    algorithmsActive={
                      algorithmsActiveObject[cameraSelect.id]
                        ? algorithmsActiveObject[cameraSelect.id]
                        : []
                    }
                    process={processLocal}
                    IPCamera={cameraSelect.id}
                    setInformationToSend={(e) => setInformationToSend(e)}
                    operationID={operationID}
                    setOperationID={(id) => setOperationID(id)}
                    isCreateCamera={isCreateCamera}
                    cameraSelect={cameraSelect}
                    cameraIP={cameraIP}
                    userName={userName}
                    password={password}
                    setConfigAlgo={(e) => setConfigAlgo(e)}
                  />
                )}
                <div className="cameras__settings_buttons">
                  <button
                    disabled={!isEnabled}
                    className="cameras__button_cancel"
                    onClick={() => setIsCameraSettings(false)}
                  >
                    Cancel
                  </button>
                  <button disabled={!isEnabled} className="cameras__button" onClick={applySettings}>
                    Done
                  </button>
                </div>
              </div>
            </section>
            {isNotification && <Notification status={false} message="Camera not create" />}
            {isPreloader && (
              <div className="cameras__preloader" onClick={() => setIsCameraSettings(false)}>
                <Preloader />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="cameras__preloader" onClick={() => setIsCameraSettings(false)}>
          <Preloader />
        </div>
      )}
    </>
  );
};

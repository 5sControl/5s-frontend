import { useEffect, useState } from 'react';
import { ArrowDown } from '../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from './algorithms/algorithmSelect';
import {
  getOperationID,
  getProcess,
  postAlgorithnDependences,
} from '../../../api/algorithmRequest';
import { findCamera } from '../../../api/cameraRequest';
import { Preloader } from '../../../components/preloader';
import { Input } from '../../../components/input';
import Combobox from 'react-widgets/Combobox';
import 'react-widgets/styles.css';
import { Notification } from '../../../components/notification/notification';
import { CameraEdit } from './cameraEdit';
import { TooltipCustom } from '../../../components/tooltip/tooltip';
import { CameraTest } from './cameraTest';

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
  const [informationToSend, setInformationToSend] = useState({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [operationID, setOperationID] = useState('');
  const [findCameraList, setFindCameraList] = useState(false);
  const [cameraIP, setCameraIP] = useState(cameraSelect.id ? cameraSelect.id : '');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isNotification, setIsNotification] = useState(false);
  const [isPreloader, setIsPreloader] = useState(false);
  const [isModalChangePassword, setIsModalChangePassword] = useState(false);

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
        response.algorithms = [...response.algorithms, { name: algorithm }];
      }
    }
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
          {!isModalChangePassword ? (
            <>
              <section className="cameras__settings">
                <div className="cameras__settings_modal">
                  <div className="cameras__settings_header">
                    <h1>Camera Settings</h1>
                  </div>
                  <p className="cameras__settings_desc">Connect to camera and configure settings</p>
                  <div className="cameras__settings_container">
                    <div className="cameras__settings_left">
                      <div className="cameras__settings_camera">
                        <h6>Settings</h6>
                        {isCreateCamera ? (
                          <>
                            <div className="cameras__settings_inputs">
                              <div>
                                <label htmlFor="cameraName">Camera IP address</label>
                                <Combobox
                                  data={findCameraList}
                                  placeholder="Select or enter"
                                  hideEmptyPopup
                                  value={cameraIP}
                                  onChange={(value) => setCameraIP(value)}
                                  onSelect={(value) => setCameraIP(value)}
                                  className="cameras__combobox"
                                  selectIcon={<ArrowDown />}
                                />
                              </div>
                            </div>
                            <div className="cameras__settings_inputs">
                              <div>
                                <label htmlFor="cameraName">
                                  Username
                                  <TooltipCustom
                                    title="Username"
                                    text={
                                      'The IP cameras username is often a default value set by the manufacturer, such as "admin" or "root". You can usually find this information in the devices user manual or on the manufacturers website.'
                                    }
                                  />
                                </label>
                                <Input
                                  type="text"
                                  value={userName}
                                  placeholder="Enter username"
                                  onChange={(e) => setUserName(e.target.value)}
                                />
                              </div>
                              <div>
                                <label htmlFor="cameraName">
                                  Password
                                  <TooltipCustom
                                    title="Password"
                                    text={
                                      'The IP cameras password is typically set by the user during the initial setup process. If you have forgotten the password, you may be able to reset it by pressing and holding the reset button on the camera for a few seconds. However, this will also reset any other settings on the camera to their default values.'
                                    }
                                  />
                                </label>
                                <Input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  showEye={true}
                                  placeholder="Enter password"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="cameras__settings_inputs">
                            <div className="cameras__settings_inputs_connection">
                              <h6>Connection</h6>
                              <h5>IP: {cameraIP}</h5>
                              <div
                                className="cameras__settings_inputs_connection_edit"
                                onClick={() => setIsModalChangePassword(true)}
                              >
                                Edit
                              </div>
                            </div>
                          </div>
                        )}
                        <h6 className="sysSettings">System settings</h6>
                        <div className="cameras__settings_inputs">
                          <div>
                            <label htmlFor="cameraName">Displayed name (optional)</label>
                            <Input
                              type="text"
                              value={cameraName}
                              onChange={(e) => setCameraName(e.target.value)}
                              placeholder="Enter displayed name"
                            />
                          </div>
                        </div>
                      </div>
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
                      />
                    </div>
                    <div className="cameras__settings_right">
                      {!isCreateCamera ? (
                        <img
                          src={
                            process.env.REACT_APP_ENV === 'proxy'
                              ? `${process.env.REACT_APP_NGROK}/images/${cameraSelect.id}/snapshot.jpg`
                              : process.env.REACT_APP_ENV === 'wify'
                              ? `${process.env.REACT_APP_IP_SERVER}images/${cameraSelect.id}/snapshot.jpg`
                              : `http://${window.location.hostname}/images/${cameraSelect.id}/snapshot.jpg`
                          }
                          alt="Camera"
                          className="cameras__settings_img"
                        />
                      ) : (
                        <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
                      )}
                    </div>
                  </div>
                  <div className="cameras__settings_buttons">
                    <button
                      disabled={!isEnabled}
                      className="cameras__button_cancel"
                      onClick={() => setIsCameraSettings(false)}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isEnabled}
                      className="cameras__button"
                      onClick={applySettings}
                    >
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
            </>
          ) : (
            <CameraEdit
              cameraIP={cameraIP}
              userName={userName}
              password={password}
              setUserName={(text) => setUserName(text)}
              setPassword={(pass) => setPassword(pass)}
              isEnabled={isEnabled}
              applySettings={applySettings}
              setIsModalChangePassword={() => setIsModalChangePassword(false)}
            />
          )}
        </>
      ) : (
        <div className="cameras__preloader" onClick={() => setIsCameraSettings(false)}>
          <Preloader />
        </div>
      )}
    </>
  );
};

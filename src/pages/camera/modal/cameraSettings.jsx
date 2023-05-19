import { useEffect, useState } from 'react';
import { ArrowDown, Close } from '../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from '../components/algorithmSelect';
import {
  getOperationID,
  getProcess,
  postAlgorithnDependences,
} from '../../../api/algorithmRequest';
import { findCamera, checkCamera } from '../../../api/cameraRequest';
import { Preloader } from '../../../components/preloader';
import { Input } from '../../../components/input';
import Combobox from 'react-widgets/Combobox';
import 'react-widgets/styles.css';
import { Notification } from '../../../components/notification/notification';

export const CameraSettings = ({
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
  const [imageTest, setImageTest] = useState('');
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
      .then((res) => {
        setIsEnabled(false);
        setIsNotificationAfterCreate();
        setIsCameraSettings(false);
        setIsPreloader(false);
      })
      .catch((res) => {
        setIsNotification(true);
        setIsPreloader(false);
      });
  };

  const cameraChecking = () => {
    checkCamera(window.location.hostname, cameraIP, userName, password)
      .then((response) => {
        console.log(response);
        return response.blob();
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setImageTest(imageUrl);
      });
  };
  useEffect(() => {
    if (!isCreateCamera) {
      setCameraName(cameraSelect.name);
      setUserName(cameraSelect.username);
      setPassword(cameraSelect.password);
    }

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
    });

    findCamera(window.location.hostname)
      .then((response) => {
        console.log(response);
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
                                <label htmlFor="cameraName">Username</label>
                                <Input
                                  type="text"
                                  value={userName}
                                  onChange={(e) => setUserName(e.target.value)}
                                />
                              </div>
                              <div>
                                <label htmlFor="cameraName">Password</label>
                                <Input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  showEye={true}
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
                        <div className="cameras__settings_inputs">
                          <div>
                            <label htmlFor="cameraName">Camera Name</label>
                            <Input
                              type="text"
                              value={cameraName}
                              onChange={(e) => setCameraName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="cameraName">Controlled workplace</label>
                            <Input type="text" />
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
                        <>
                          {' '}
                          <img src={imageTest} alt="Camera" className="cameras__settings_img" />
                          <span className="cameras__settings_test" onClick={cameraChecking}>
                            Test connection
                          </span>
                          <span className="cameras__settings_text">
                            Test connection after selecting a camera and filling in its’ username
                            and password.
                          </span>
                        </>
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
            <section className="cameras__settings">
              <div className="cameras__settings_modalLIL">
                <div className="cameras__settings_header">
                  <h1>Camera connection</h1>
                </div>

                <p className="cameras__settings_descLIL">Camera IP adress</p>
                <h5 className="cameras__settings_ipLIL">{cameraIP}</h5>
                <div className="cameras__settings_containerLIL">
                  <div className="cameras__settings_left">
                    <div className="cameras__settings_cameraLIL">
                      <label htmlFor="cameraName">Username</label>
                      <Input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />

                      <label htmlFor="cameraName">Password</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showEye={true}
                      />
                    </div>
                  </div>
                  <div className="cameras__settings_right">
                    <img src={imageTest} alt="Camera" className="cameras__settings_img" />

                    <span className="cameras__settings_test" onClick={cameraChecking}>
                      Test connection
                    </span>
                    <span className="cameras__settings_text">
                      Test connection after selecting a camera and filling in its’ username and
                      password.
                    </span>
                  </div>
                </div>
                <div className="cameras__settings_buttons">
                  <button
                    disabled={!isEnabled}
                    className="cameras__button_cancel"
                    onClick={() => setIsModalChangePassword(false)}
                  >
                    Cancel
                  </button>
                  <button disabled={!isEnabled} className="cameras__button" onClick={applySettings}>
                    Done
                  </button>
                </div>
              </div>
            </section>
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

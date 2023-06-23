import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getSelectedCameras } from '../../api/cameraRequest';
import { Button } from '../../components/button';
import { CamerasDeleteModal } from './modal/delete/camerasDeleteModal';
import { getProcess } from '../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../functions/parsingAlgorithmName';
import { SettingsHub } from './modal/settingsHub';
import { DeleteClear, Plus } from '../../assets/svg/SVGcomponent';
import { Notification } from '../../components/notification/notification';

import s from '../configuration/configuration.module.scss';
import styles from './camera.module.scss';
import './cameras.scss';

export const Camera = () => {
  const [cookies] = useCookies(['token']);
  const [createdCameras, setCreatedCameras] = useState(false);
  const [error, setError] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [cameraSelect, setCameraSelect] = useState(false);
  const [isCreateCamera, setIsCreateCamera] = useState(false);
  const [isNotificationAfterCreate, setIsNotificationAfterCreate] = useState(false);

  useEffect(() => {
    if (!cameraSelect) {
      getProcess(window.location.hostname, cookies.token)
        .then((response) => {
          if (response && response.data && response.data.length > 0) {
            setProcessList(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [cameraSelect]);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        if (response.data.length > 0) {
          setCreatedCameras(response.data);
        }
      })
      .catch((error) => setError(error.message));
  }, [isDeleteModal, cameraSelect]);

  const showAddCameras = () => {
    setIsCreateCamera(true);
    setCameraSelect(true);
  };

  const deleteCamera = (camera) => {
    setIsDeleteModal(camera);
  };

  const handleClickCamera = (el) => {
    setIsCreateCamera(false);
    setCameraSelect(el);
  };

  useEffect(() => {
    if (isNotificationAfterCreate) {
      setTimeout(() => setIsNotificationAfterCreate(false), 2000);
    }
  }, [isNotificationAfterCreate]);

  return (
    <section className={styles.cameras}>
      <Button
        text="Add camera"
        className={s.buttonPosition}
        onClick={showAddCameras}
        IconLeft={Plus}
      />

      {createdCameras && (
        <div className={styles.cameras__list}>
          {createdCameras.map((el, ind) => {
            return (
              <div key={ind} className={styles.cameras__list_item}>
                <div onClick={() => handleClickCamera(el)}>
                  <img
                    className={styles.cameras__list_image}
                    src={
                      process.env.REACT_APP_ENV === 'proxy'
                        ? `${process.env.REACT_APP_NGROK}images/${el.id}/snapshot.jpg`
                        : process.env.REACT_APP_ENV === 'wify'
                        ? `${process.env.REACT_APP_IP_SERVER}images/${el.id}/snapshot.jpg`
                        : `http://${window.location.hostname}/images/${el.id}/snapshot.jpg`
                    }
                    alt="Camera"
                  />
                  <div>
                    <div className={styles.cameras__name}>Name: {el.name}</div>
                    <div className={styles.cameras__desciption}>
                      Algorithms:{' '}
                      {processList
                        .filter((element) => element.camera.id === el.id)
                        .map((item, index) => (
                          <span key={index}>
                            {parsingAlgorithmName(item.algorithm.name)},&nbsp;
                          </span>
                        ))}
                    </div>
                    <div className={styles.cameras__desciption}>IP: {el.id}</div>
                  </div>
                </div>
                <DeleteClear
                  className={styles.cameras__list_delete}
                  onClick={() => deleteCamera(el.id)}
                />
              </div>
            );
          })}
        </div>
      )}
      {isNotificationAfterCreate && <Notification status={true} message={'Camera saved'} />}
      {error && <div style={{ color: 'red', fontSize: '26px' }}>{error}</div>}
      {isDeleteModal && (
        <CamerasDeleteModal
          cancelClick={() => setIsDeleteModal(false)}
          processList={processList}
          camera={isDeleteModal}
          token={cookies.token}
        />
      )}

      {cameraSelect && (
        <SettingsHub
          cameraSelect={cameraSelect}
          token={cookies.token}
          setIsCameraSettings={(bool) => setCameraSelect(bool)}
          isCreateCamera={isCreateCamera}
          camerasList={createdCameras}
          setIsNotificationAfterCreate={() => setIsNotificationAfterCreate(true)}
        />
      )}
    </section>
  );
};

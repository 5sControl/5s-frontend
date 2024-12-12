import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getSelectedCameras, findCamera, deleteCameraAPI } from '../../api/cameraRequest';
import { getProcess } from '../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../utils/parsingAlgorithmName';
import { DeleteRedIcon, Plus } from '../../assets/svg/SVGcomponent';
import { Notification } from '../../components/notification/notification';

import styles from './camera.module.scss';
import './cameras.scss';
import { ConfirmationModal } from '../../components/confirmationModal/confirmationModal';
import Fab from '../../components/fab/Fab';
import { IonContent, IonListHeader, IonPage, useIonViewWillEnter } from '@ionic/react';
import { Header } from '../../components/header/Header';
import { ROUTES } from '../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { Preloader } from '../../components/preloader/preloader';
import { useHistory } from 'react-router';
import { SelectItem } from '../../models/types/selectItem';

const Cameras = () => {
  const [cookies] = useCookies(['token']);
  const [createdCameras, setCreatedCameras] = useState<any>([]);
  const [error, setError] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [processList, setProcessList] = useState([]);
  const [cameraSelect, setCameraSelect] = useState(false);
  const [isCreateCamera, setIsCreateCamera] = useState(false);
  const [isNotificationAfterCreate, setIsNotificationAfterCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const [cameraToDelete, setCameraToDelete] = useState('');

  useIonViewWillEnter(() => {
      // if (!cameraSelect) {
      getProcess(window.location.hostname, cookies.token)
        .then((response) => {
          if (response && response.data && response.data.length > 0) {
            setProcessList(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    // }
  });

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        if (response.data.length > 0) {
          setCreatedCameras(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        }
      })
      .catch((error) => setError(error.message));
  }, [isDeleteModal, cameraSelect]);

  const deleteCamera = (camera) => {
    setCameraToDelete(camera);
    setIsDeleteModal(true);
  };

  const onDeleteConfirm = () => {
    deleteCameraAPI(window.location.hostname, cookies.token, cameraToDelete)
      .then((response) => {
        if (response.status === 200) {
          setIsDeleteModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickCamera = (el) => {
    setIsCreateCamera(false);
    setCameraSelect(el);
    history.push(ROUTES.CAMERA_EDIT(el.id));
  };

  const handleFabClick = () => {
    history.push(ROUTES.CAMERA_ADD);
  };

  useEffect(() => {
    if (isNotificationAfterCreate) {
      setTimeout(() => setIsNotificationAfterCreate(false), 2000);
    }
  }, [isNotificationAfterCreate]);

  return (
    <IonPage>
        <Header
        title="Конфигурация"
        backButtonHref={ROUTES.MENU}
        />
        <IonContent>
        {loading ? (
            <div className="preloader">
                <Preloader />
            </div>
        ) : (
            <>
        <div className='ion-padding'>
            <IonListHeader>
                Камеры
            </IonListHeader>
            <div>
                Подключение к камерам в локальной сети для непрерывного мониторинга.
            </div>
        </div>
       
        <Fab icon={Plus} handleFabClick={handleFabClick} />

      {createdCameras && (
        <div className={styles.cameras__list}>
          {createdCameras.map((el, ind) => {
            return (
              <div key={ind} className={styles.cameras__list_item}>
                <div onClick={() => handleClickCamera(el)}>
                  <img
                    className={styles.cameras__list_image}
                    src={`${import.meta.env.VITE_API_BASE_URL}images/${el.id}/snapshot.jpg`}
                    alt='Camera'
                  />
                  <div>
                    <div className={styles.cameras__name}>Name: {el.name}</div>
                    <div className={styles.cameras__desciption}>
                      Algorithms:{' '}
                      {processList
                        .filter((element: any) => element.camera.id === el.id)
                        .map((item: any, index, array) => (
                          <span key={index}>
                            {`${parsingAlgorithmName(item.algorithm.name)}${
                              array.length - 1 > index ? ', ' : ''
                            }`}
                          </span>
                        ))}
                    </div>
                    <div className={styles.cameras__desciption}>IP: {el.id}</div>
                  </div>
                </div>
                <img
                  src={DeleteRedIcon}
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
        <ConfirmationModal 
            type="danger" 
            isOpen={isDeleteModal} 
            onClose={() => setIsDeleteModal(false)} 
            onConfirm={onDeleteConfirm} 
            title="Remove a camera?" 
            confirmText="Remove"
            cancelText="Cancel" />
      </>
      )}
    </IonContent>
  </IonPage>
  );
};

export default Cameras;
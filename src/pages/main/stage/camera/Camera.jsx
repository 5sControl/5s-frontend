import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CamerasModal } from './modal/camerasModal';
import './cameras.scss';
import { findCamera, getSelectedCameras } from '../../../../api/cameraRequest';
import { getIsInternet, url } from '../../../../api/api';
import { CameraSettings } from './modal/cameraSettings';

export const Camera = () => {
  const [cookies] = useCookies(['token']);
  const [camerasList, setCamerasList] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isCameraSettings, setIsCameraSettings] = useState(false);
  const [createdCameras, setCreatedCameras] = useState(false);
  const [IPCamera, setIPCamera] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          setCreatedCameras(response.data);
        }
      })
      .catch((error) => setError(error.message));

    findCamera(window.location.hostname)
      .then((response) => {
        setCamerasList(response.data.results);
      })
      .catch((error) => setError(error.message));
  }, [isShowModal, isCameraSettings]);

  const showAddCameras = () => {
    setIsShowModal(true);
  };

  const openSettings = (ip) => {
    setIPCamera(ip);
    setIsCameraSettings(true);
  };

  return (
    <section className="cameras">
      <div className="cameras__title">
        <h1>Cameras</h1>
        <button className="cameras__button" onClick={showAddCameras}>
          + Add Camera
        </button>
      </div>
      {createdCameras && (
        <div className="cameras__list">
          {createdCameras.map((el, ind) => {
            return (
              <div key={ind} className="cameras__list_item" onClick={() => openSettings(el.id)}>
                <img
                  className="cameras__list_image"
                  src={
                    getIsInternet(window.location.hostname)
                      ? `${url}/images/${el.id}/snapshot.jpg`
                      : `http://${window.location.hostname}/images/${el.id}/snapshot.jpg`
                  }
                  alt="Camera"
                />
                <>Name: {el.name}</>
              </div>
            );
          })}
        </div>
      )}
      {error && <div style={{ color: 'red', fontSize: '26px' }}>{error}</div>}
      {isShowModal && (
        <CamerasModal
          setIsShowModal={(e) => setIsShowModal(e)}
          cookies={cookies}
          setIPCamera={(e) => setIPCamera(e)}
          IPCamera={IPCamera}
          camerasList={camerasList}
        />
      )}
      {isCameraSettings && (
        <CameraSettings
          IPCamera={IPCamera}
          nameCamera={createdCameras.filter((camera) => camera.id === IPCamera)[0].name}
          token={cookies.token}
          setIsCameraSettings={(e) => setIsCameraSettings(e)}
        />
      )}
    </section>
  );
};

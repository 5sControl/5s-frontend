import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CamerasModal } from './modal/camerasModal';
import './cameras.scss';
import { findCamera, getSelectedCameras } from '../../api/cameraRequest';
import { CameraSettings } from './modal/cameraSettings';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Button } from '../button';

export const Camera = () => {
  const [cookies] = useCookies(['token']);
  const [camerasList, setCamerasList] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isCameraSettings, setIsCameraSettings] = useState(false);
  const [createdCameras, setCreatedCameras] = useState(false);
  const [IPCamera, setIPCamera] = useState('');
  const [error, setError] = useState(false);
  const [security, setSecurity] = useState(false);

  useEffect(() => {
    if (isShowModal) {
      findCamera(window.location.hostname)
        .then((response) => {
          setCamerasList(response.data.results);
        })
        .catch((error) => setError(error.message));
    } else {
      setCamerasList(false);
    }
  }, [isShowModal]);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        // console.log(response);
        if (response.data.length > 0) {
          setCreatedCameras(response.data);
        }
      })
      .catch((error) => setError(error.message));
  }, [isCameraSettings, isShowModal]);

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
        <h2>Cameras</h2>
        <Button text="+ Add Camera" onClick={showAddCameras} />
      </div>
      {createdCameras && (
        <div className="cameras__list">
          {createdCameras.map((el, ind) => {
            return (
              <Link
                to={`/configuration/${el.id}`}
                key={ind}
                className="cameras__list_item"
                onClick={() => openSettings(el.id)}
              >
                <div>
                  <img
                    className="cameras__list_image"
                    src={
                      process.env.REACT_APP_ENV === 'proxy'
                        ? `${process.env.REACT_APP_NGROK}/images/${el.id}/snapshot.jpg`
                        : process.env.REACT_APP_ENV === 'wify'
                        ? `${process.env.REACT_APP_IP_SERVER}images/${el.id}/snapshot.jpg`
                        : `http://${window.location.hostname}/images/${el.id}/snapshot.jpg`
                    }
                    alt="Camera"
                  />
                  <div>
                    <div>Name: {el.name}</div>
                    <div>IP: {el.id}</div>
                  </div>
                </div>
                <AiOutlineArrowRight />
              </Link>
            );
          })}
          {/* <div onClick={() => setSecurity(!security)}> Security </div>
          {security && (
            <div className="security">
              {createdCameras &&
                createdCameras.map((el) => {
                  return (
                    <video
                      id="videoPlayer"
                      key={el.id}
                      src={`http://${window.location.href}:3456/stream?camera_ip=${el.id}`}
                      controls
                      autoPlay
                    ></video>
                  );
                })}
            </div>
          )} */}
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

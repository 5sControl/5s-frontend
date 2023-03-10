import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import { getSelectedCameras } from '../../../api/cameraRequest';
import { Back } from '../../../assets/svg/SVGcomponent';
import './camera-config.scss';
import { Preloader } from '../../../components/preloader';
import { CameraSettings } from '../../../components/camera/modal/cameraSettings';
export const ConfigurationCamera = () => {
  const [camera, setCamera] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [cookie] = useCookies(['token']);
  const navigate = useNavigate();
  const location = useParams();

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookie.token).then((res) => {
      setCamera(res.data.filter((camera) => camera.id === location.camera)[0]);
    });
  }, []);

  return (
    <>
      {Object.keys(camera).length > 0 ? (
        <section className="camera-config">
          <Back onClick={() => navigate(-1)} />
          <div className="camera-config__title">
            <h1>{camera.name}</h1>
            <button className="camera-config__button" onClick={() => setIsShowModal(true)}>
              Settings
            </button>
          </div>
          <h2>Algorithms</h2>
          <div className="camera-config__algorithms"></div>
        </section>
      ) : (
        <Preloader loading={true} />
      )}
      {isShowModal && (
        <CameraSettings
          IPCamera={camera.id}
          nameCamera={camera.name}
          token={cookie.token}
          setIsCameraSettings={(e) => setIsShowModal(e)}
        />
      )}
    </>
  );
};

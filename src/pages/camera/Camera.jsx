import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CamerasModal } from '../../pages/camera/modal/camerasModal';
import './cameras.scss';
import { findCamera, getSelectedCameras } from '../../api/cameraRequest';
import { Link } from 'react-router-dom';

export const Camera = () => {
  const [cookies] = useCookies(['token']);
  const [camerasList, setCamerasList] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [createdCameras, setCreatedCameras] = useState(false);

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
  }, []);

  const showAddCameras = () => {
    setIsShowModal(true);
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
              <Link key={ind} to={`/camera/${el.id}`} className="cameras__list_item">
                <>IP: {el.id}</>
              </Link>
            );
          })}
        </div>
      )}
      {error && <div style={{ color: 'red', fontSize: '26px' }}>{error}</div>}
      {isShowModal && (
        <CamerasModal
          setIsShowModal={(e) => setIsShowModal(e)}
          cookies={cookies}
          camerasList={camerasList}
          setCreatedCameras={(e) => setCreatedCameras([...createdCameras, e])}
        />
      )}
    </section>
  );
};

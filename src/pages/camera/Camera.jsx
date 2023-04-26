import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CamerasModal } from './modal/camerasModal';
import './cameras.scss';
import { findCamera, getSelectedCameras } from '../../api/cameraRequest';
import { MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/button';
import { CamerasDeleteModal } from './modal/camerasDeleteModal';
import { getProcess } from '../../api/algorithmRequest';

export const Camera = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [camerasList, setCamerasList] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [createdCameras, setCreatedCameras] = useState(false);
  const [IPCamera, setIPCamera] = useState('');
  const [error, setError] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [processList, setProcessList] = useState([]);

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
    getProcess(window.location.hostname, cookies.token).then((response) => {
      if (response && response.data && response.data.length > 0) {
        setProcessList(response.data);
      }
    });
  }, []);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        // console.log(response);
        if (response.data.length > 0) {
          setCreatedCameras(response.data);
        }
      })
      .catch((error) => setError(error.message));
  }, [isShowModal]);

  const showAddCameras = () => {
    setIsShowModal(true);
  };

  const deleteCamera = (camera) => {
    setIsDeleteModal(camera);
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
              <div key={ind} className="cameras__list_item">
                <div onClick={() => navigate(`/configuration/${el.id}`)}>
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
                <MdDeleteOutline
                  className="cameras__list_delete"
                  onClick={() => deleteCamera(el.id)}
                />
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

      {isDeleteModal && (
        <CamerasDeleteModal
          cancelClick={() => setIsDeleteModal(false)}
          processList={processList}
          camera={isDeleteModal}
        />
      )}
    </section>
  );
};

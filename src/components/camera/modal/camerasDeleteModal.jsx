import { useEffect, useState } from 'react';
import { deleteCameraAPI } from '../../../api/cameraRequest';

export const CamerasDeleteModal = ({ cancelClick, processList, camera }) => {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    setAlgorithms(processList.filter((el) => el.camera.id === camera));
  }, []);
  const deleteCamera = () => {
    // deleteCameraAPI(window.location.hostname, cookies.token, camera);
  };
  return (
    <section className="deleteModal">
      <div className="deleteModal__container">
        <h1>Remove a camera?</h1>
        <p>You will no longer get reports from this camera.</p>
        {algorithms.length > 0 && (
          <div>
            <span>This camera has the following algorithms:</span>
            <ul>
              {algorithms.map((algorithm, id) => (
                <li key={id}>{algorithm.algorithm.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="deleteModal__footer">
          <button type="button" className="deleteModal__footer_cancel" onClick={cancelClick}>
            Cancel
          </button>
          <button type="button" className="deleteModal__footer_remove" onClick={deleteCamera}>
            Remove
          </button>
        </div>
      </div>
    </section>
  );
};

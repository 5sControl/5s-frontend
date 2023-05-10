import { useEffect, useState } from 'react';
import { deleteCameraAPI } from '../../../api/cameraRequest';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';

export const CamerasDeleteModal = ({ cancelClick, processList, camera, token }) => {
  const [algorithms, setAlgorithms] = useState([]);

  useEffect(() => {
    setAlgorithms(processList.filter((el) => el.camera.id === camera));
  }, []);

  const deleteCamera = () => {
    deleteCameraAPI(window.location.hostname, token, camera)
      .then((response) => {
        if (response.status === 200) {
          cancelClick();
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                <li key={id}>{parsingAlgorithmName(algorithm.algorithm.name)}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="deleteModal__footer">
          <button
            type="button"
            className="deleteModal__footer_button deleteModal__footer_cancel"
            onClick={cancelClick}
          >
            Cancel
          </button>
          <button
            type="button"
            className="deleteModal__footer_button  deleteModal__footer_remove"
            onClick={deleteCamera}
          >
            Remove
          </button>
        </div>
      </div>
    </section>
  );
};

import { CameraTest } from '../testConection/cameraTest';

export const RightSection = ({ isCreateCamera, cameraSelect, cameraIP, userName, password }) => {
  return (
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
        <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
      )}
    </div>
  );
};

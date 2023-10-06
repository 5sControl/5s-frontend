import { CameraTest } from '../testConection/cameraTest';

export const RightSection = ({ isCreateCamera, cameraSelect, cameraIP, userName, password }) => {
  return (
    <div className="cameras__settings_right">
      {!isCreateCamera ? (
        <img
          src={`${process.env.REACT_APP_NGROK}/images/${cameraSelect.id}/snapshot.jpg`}
          alt="Camera"
          className="cameras__settings_img"
        />
      ) : (
        <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
      )}
    </div>
  );
};

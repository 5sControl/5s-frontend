/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { checkCamera } from '../../../../api/cameraRequest';
import { Preloader } from '../../../../components/preloader';
import { Notification } from '../../../../components/notification/notification';

type PropsType = {
  cameraIP: string;
  userName: string;
  password: string;
};

export const CameraTest: React.FC<PropsType> = ({ cameraIP, userName, password }): JSX.Element => {
  const [imageTest, setImageTest] = useState('');
  const [isPreloader, setPreloader] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  const cameraChecking = async () => {
    setPreloader(true);
    setImageTest("");
   const response = await checkCamera(window.location.hostname, cameraIP, userName, password)

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageTest(imageUrl);
      setPreloader(false);
      setIsNotification(true);
    } else {
      setPreloader(false);
      setIsNotification(true);
    }
  };

  useEffect(() => {
    if (isNotification) {
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    }
  }, [isNotification]);

  return (
    <div className='cameras__settings_right'>
      {imageTest === '' ? (
        <div className='cameras__settings_img'>
          <div className='cameras__settings_img_bad'>{isPreloader && <Preloader />}</div>
        </div>
      ) : (
        <img src={imageTest} alt='Camera' className='cameras__settings_img' />
      )}
      <span className='cameras__settings_test' onClick={cameraChecking}>
        Test connection
      </span>
      <span className='cameras__settings_text'>
        Test connection after selecting a camera and filling in its’ username and password.
      </span>
      {isNotification && (
        <Notification
          status={!!imageTest.length}
          message={imageTest.length ? 'Connected to the camera' : 'Failed to connect to the camera'}
          isLil={true}
        />
      )}
    </div>
  );
};

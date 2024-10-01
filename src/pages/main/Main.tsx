import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Congratulations } from './components/firstScreen';
import { getSelectedCameras } from '../../api/cameraRequest';
import { useCookies } from 'react-cookie';
import { useIsMobile } from '../../hooks/useIsMobile';

export const Main = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token).then((response) => {
      setIsLoading(false);
      if (isMobile) {
        navigate('/mobile');
        return;
      }
      if (response.data.length > 0 || localStorage.getItem('firtEnter') === 'true') {
        navigate('/dashboard');
      }
    });
  }, []);

  const firtEnter = () => {
    localStorage.setItem('firtEnter', 'true');
    navigate('/configuration');
  };
  return <Congratulations setStage={firtEnter} isLoading={isLoading} />;
};

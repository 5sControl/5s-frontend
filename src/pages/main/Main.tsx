import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Congratulations } from './components/firstScreen';

export const Main = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('firtEnter') === 'true') {
      navigate('/dashboard');
    }
  }, []);

  const firtEnter = () => {
    localStorage.setItem('firtEnter', 'true');
    navigate('/configuration');
  };
  return <Congratulations setStage={firtEnter} />;
};

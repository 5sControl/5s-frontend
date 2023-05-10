import { useEffect } from 'react';
import './main.scss';

import { Congratulations } from './stage/firstScreen';
import { useNavigate } from 'react-router-dom';

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
  return (
    <>
      <Congratulations setStage={firtEnter} />
    </>
  );
};

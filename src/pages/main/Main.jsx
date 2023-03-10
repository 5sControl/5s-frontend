import './main.scss';

import { Congratulations } from './stage/firstScreen';
import { useNavigate } from 'react-router-dom';

export const Main = () => {
  const navigate = useNavigate();

  return (
    <>
      <Congratulations setStage={() => navigate('/configuration')} />
    </>
  );
};

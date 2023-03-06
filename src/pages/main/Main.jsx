import './main.scss';

import { useState } from 'react';
import { Congratulations } from './stage/firstScreen';
import { useNavigate } from 'react-router-dom';
import { Camera } from '../camera/Camera';
import { useCookies } from 'react-cookie';
import { AlogorithmStage } from './stage/algorithm';

export const Main = () => {
  const [stage, setStage] = useState('begin');
  const [cookies] = useCookies(['token']);
  const [showAfterRegistration, setShowAfterRegistration] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {localStorage.getItem('registration') === 'true' && (
        <div className="showAfterRegistration">
          <div className="showAfterRegistration__container">
            <h4>You are already registered</h4>
            <button
              className="showAfterRegistration__button"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
      <>
        {stage === 'begin' && <Congratulations setStage={(e) => setStage(e)} />}
        {stage === 'cameras' && <Camera />}
        {stage === 'algorithm' && (
          <AlogorithmStage
            token={cookies.token}
            setShowAfterRegistration={(e) => setShowAfterRegistration(e)}
          />
        )}
        <div className={stage === 'cameras' ? 'visible' : 'novisible'}>
          <button
            // className={algorithmCount > 5 ? "noclick" : ""}
            onClick={() => setStage('algorithm')}
          >
            Continue
          </button>
        </div>

        {showAfterRegistration && (
          <div className="showAfterRegistration">
            <div className="showAfterRegistration__container">
              <h4>{showAfterRegistration}</h4>
              <button
                className="showAfterRegistration__button"
                onClick={() => navigate('/dashboard')}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
};

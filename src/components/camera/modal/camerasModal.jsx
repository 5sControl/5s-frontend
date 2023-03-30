import { useState } from 'react';
import { Close } from '../../../assets/svg/SVGcomponent';
import { AiOutlineRight } from 'react-icons/ai';
import { postCamera } from '../../../api/cameraRequest';

export const CamerasModal = ({ setIsShowModal, cookies, camerasList, setIPCamera, IPCamera }) => {
  const [stage, setStage] = useState('selectCamera');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [connectMessage, setConnectMessage] = useState('');

  const connect = () => {
    postCamera(window.location.hostname, IPCamera, username, password, cookies.token).then((e) => {
      if (e.data.message && e.data.message.includes('failed')) {
        setConnectMessage(e.data.message);
      } else {
        setIsShowModal(false);
      }
    });
  };

  return (
    <div className="cameras__modal">
      <div className="cameras__modal__container">
        {stage === 'selectCamera' && camerasList.length > 0 && (
          <>
            <div className="cameras__modal__title">
              <h2>Select a camera from your local network</h2>
              <Close
                onClick={() => setIsShowModal(false)}
                className="cameras__modal__title_close pointer"
              />
            </div>
            <div className="cameras__modal__list">
              {camerasList.map((el, ind) => {
                return (
                  el.length > 0 && (
                    <div
                      key={ind}
                      className="cameras__modal__list_item"
                      onClick={() => {
                        setStage('logAndPass');
                        setIPCamera(el);
                      }}
                    >
                      <span>{el}</span>
                      <AiOutlineRight />
                    </div>
                  )
                );
              })}
            </div>
          </>
        )}
        {stage === 'logAndPass' && (
          <>
            <div className="cameras__modal__title">
              <h2>{IPCamera}</h2>
              <Close
                onClick={() => setIsShowModal(false)}
                className="cameras__modal__title_close"
              />
            </div>
            <div className="cameras__modal__login">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setConnectMessage('')}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setConnectMessage('')}
              />
              <div style={{ color: 'red' }}>{connectMessage}</div>
              <div className="cameras__modal__login__footer">
                <button
                  className="cameras__modal__login__cancel"
                  onClick={() => setStage('selectCamera')}
                >
                  Cancel
                </button>
                <button className="cameras__modal__login__create" onClick={connect}>
                  Connect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

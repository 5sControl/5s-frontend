import { useState } from 'react';
import { Close } from '../../../assets/svg/SVGcomponent';
import { AiOutlineRight } from 'react-icons/ai';
import { postCamera } from '../../../api/cameraRequest';
import { Input } from '../../../components/input';
import { Preloader } from '../../../components/preloader';

export const AddCamera = ({ setIsShowModal, cookies, camerasList, setIPCamera, IPCamera }) => {
  const [stage, setStage] = useState('selectCamera');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [connectMessage, setConnectMessage] = useState('');

  const connect = () => {
    postCamera(window.location.hostname, IPCamera, username, password, cookies.token).then((e) => {
      console.log(e);
      if (
        (e.data.message && e.data.message.includes('failed')) ||
        (e.data.detail && e.data.detail.includes('were not provided')) ||
        e.data.error
      ) {
        setConnectMessage(
          e.data.detail + '  ' + e.data.message + ' ' + e.data.error
            ? 'This camera already exists'
            : ''
        );
      } else {
        setIsShowModal(false);
        // navigate('/configuration/' + IPCamera);
      }
    });
  };

  return (
    <div className="cameras__modal">
      <div className="cameras__modal__container">
        {stage === 'selectCamera' && !camerasList && <Preloader loading={true} />}
        {stage === 'selectCamera' && camerasList && camerasList.length > 0 && (
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
        {stage === 'selectCamera' && camerasList && camerasList.length === 0 && (
          <>
            <div className="cameras__modal__title">
              <h2>Select a camera from your local network</h2>
              <Close
                onClick={() => setIsShowModal(false)}
                className="cameras__modal__title_close pointer"
              />
            </div>
            <div>No cameras found on the network</div>
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
              <label className="label_bot">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setConnectMessage('')}
                showEye={true}
              />
              <div style={{ color: 'red' }}>{connectMessage}</div>
              <div className="cameras__modal__login__footer label_bot">
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

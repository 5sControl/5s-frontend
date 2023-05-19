/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '../../../components/input';

type PropsType = {
  cameraIP: string;
  userName: string;
  password: string;
  setUserName: (text: string) => void;
  setPassword: (text: string) => void;
  isEnabled: boolean;
  cameraChecking: () => void;
  applySettings: () => void;
  imageTest: string;
  setIsModalChangePassword: () => void;
};
export const CameraTest: React.FC<PropsType> = ({
  cameraIP,
  userName,
  password,
  setUserName,
  setPassword,
  isEnabled,
  cameraChecking,
  applySettings,
  imageTest,
  setIsModalChangePassword,
}): JSX.Element => {
  return (
    <section className="cameras__settings">
      <div className="cameras__settings_modalLIL">
        <div className="cameras__settings_header">
          <h1>Camera connection</h1>
        </div>
        <p className="cameras__settings_descLIL">Camera IP adress</p>
        <h5 className="cameras__settings_ipLIL">{cameraIP}</h5>
        <div className="cameras__settings_containerLIL">
          <div className="cameras__settings_left">
            <div className="cameras__settings_cameraLIL">
              <label htmlFor="cameraName">Username</label>
              <Input
                id="1"
                name="userName"
                type="text"
                value={userName}
                onChange={(e: any) => setUserName(e.target.value)}
              />

              <label htmlFor="cameraName">Password</label>
              <Input
                id="2"
                name="password"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                showEye={true}
              />
            </div>
          </div>
          <div className="cameras__settings_right">
            <img src={imageTest} alt="Camera" className="cameras__settings_img" />
            <span className="cameras__settings_test" onClick={cameraChecking}>
              Test connection
            </span>
            <span className="cameras__settings_text">
              Test connection after selecting a camera and filling in its’ username and password.
            </span>
          </div>
        </div>
        <div className="cameras__settings_buttons">
          <button
            disabled={!isEnabled}
            className="cameras__button_cancel"
            onClick={setIsModalChangePassword}
          >
            Cancel
          </button>
          <button disabled={!isEnabled} className="cameras__button" onClick={applySettings}>
            Done
          </button>
        </div>
      </div>
    </section>
  );
};

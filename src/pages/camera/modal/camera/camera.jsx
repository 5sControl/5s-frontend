import { useState } from 'react';
import { Input } from '../../../../components/input';
import Combobox from 'react-widgets/Combobox';
import { TooltipCustom } from '../../../../components/tooltip/tooltip';
import { ArrowDown } from '../../../../assets/svg/SVGcomponent';
import 'react-widgets/styles.css';
import { CameraEdit } from './cameraEdit';
import { RightSection } from '../rightSection/right';
export const Camera = ({
  cameraIP,
  isCreateCamera,
  cameraSelect,
  findCameraList,
  password,
  userName,
  setCameraIP,
  applySettings,
  isEnabled,
  cameraName,
  setUserName,
  setCameraName,
  setPassword,
}) => {
  const [isModalChangePassword, setIsModalChangePassword] = useState(false);
  return (
    <>
      <div className="cameras__settings_container">
        <div className="cameras__settings_left">
          <div className="cameras__settings_camera">
            <h6>Settings</h6>
            {isCreateCamera ? (
              <>
                <div className="cameras__settings_inputs">
                  <div>
                    <label htmlFor="cameraName">Camera IP address</label>
                    <Combobox
                      data={findCameraList}
                      placeholder="Select or enter"
                      hideEmptyPopup
                      value={cameraIP}
                      onChange={(value) => setCameraIP(value)}
                      onSelect={(value) => setCameraIP(value)}
                      className="cameras__combobox"
                      selectIcon={<ArrowDown />}
                    />
                  </div>
                </div>
                <div className="cameras__settings_inputs">
                  <div>
                    <label htmlFor="cameraName">
                      Username
                      <TooltipCustom
                        title="Username"
                        text={
                          'The IP cameras username is often a default value set by the manufacturer, such as "admin" or "root". You can usually find this information in the devices user manual or on the manufacturers website.'
                        }
                      />
                    </label>
                    <Input
                      type="text"
                      value={userName}
                      placeholder="Enter username"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="cameraName">
                      Password
                      <TooltipCustom
                        title="Password"
                        text={
                          'The IP cameras password is typically set by the user during the initial setup process. If you have forgotten the password, you may be able to reset it by pressing and holding the reset button on the camera for a few seconds. However, this will also reset any other settings on the camera to their default values.'
                        }
                      />
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      showEye={true}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="cameras__settings_inputs">
                <div className="cameras__settings_inputs_connection">
                  <h6>Connection</h6>
                  <h5>IP: {cameraIP}</h5>
                  <div
                    className="cameras__settings_inputs_connection_edit"
                    onClick={() => setIsModalChangePassword(true)}
                  >
                    Edit
                  </div>
                </div>
              </div>
            )}
            <h6 className="sysSettings">System settings</h6>
            <div className="cameras__settings_inputs">
              <div>
                <label htmlFor="cameraName">Displayed name (optional)</label>
                <Input
                  type="text"
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  placeholder="Enter displayed name"
                />
              </div>
            </div>
          </div>
        </div>
        <RightSection
          isCreateCamera={isCreateCamera}
          cameraSelect={cameraSelect}
          cameraIP={cameraIP}
          userName={userName}
          password={password}
        />
      </div>
      {isModalChangePassword && (
        <CameraEdit
          cameraIP={cameraIP}
          userName={userName}
          password={password}
          setUserName={(text) => setUserName(text)}
          setPassword={(pass) => setPassword(pass)}
          isEnabled={isEnabled}
          applySettings={applySettings}
          setIsModalChangePassword={() => setIsModalChangePassword(false)}
        />
      )}
    </>
  );
};

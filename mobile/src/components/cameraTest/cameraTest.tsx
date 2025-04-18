/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { checkCamera } from "../../api/cameraRequest";
import { Preloader } from "../preloader/preloader";
import { Notification } from "../notification/notification";
import { useTranslation } from "react-i18next";

type PropsType = {
  cameraIP: string;
  userName: string;
  password: string;
};

const CameraTest: React.FC<PropsType> = ({ cameraIP, userName, password }): JSX.Element => {
  const [imageTest, setImageTest] = useState("");
  const [isPreloader, setPreloader] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const { t } = useTranslation();

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
    <div className="cameras__settings_right">
      {imageTest === "" ? (
        <div className="cameras__settings_img">
          <div className="cameras__settings_img_bad">{isPreloader && <Preloader />}</div>
        </div>
      ) : (
        <img src={imageTest} alt="Camera" className="cameras__settings_img" />
      )}
      <span className="cameras__settings_test" onClick={cameraChecking}>
        {t("camera.cameraSegment.testConnection")}
      </span>
      <span className="cameras__settings_text">{t("camera.cameraSegment.testTip")}</span>
      {isNotification && (
        <Notification
          status={!!imageTest.length}
          message={
            imageTest.length ? t("camera.cameraSegment.status.connected") : t("camera.cameraSegment.status.failed")
          }
          // isLil={true}
        />
      )}
    </div>
  );
};

export default CameraTest;

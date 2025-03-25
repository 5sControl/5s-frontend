import { IonNote } from "@ionic/react";
import { useEffect, useState } from "react";
import DynamicSelectInput from "../selects/select/Select";
import { Input } from "../inputs/input/Input";
import "../../styles/common.scss";
import CameraTest from "../cameraTest/cameraTest";
import styles from "./cameraSegment.module.scss";
import { SelectItem } from "../../models/types/selectItem";
import InputReadonly from "../inputs/inputReadonly/inputReadonly";
import { useTranslation } from "react-i18next";
import { findCamera, getSelectedCameras } from "../../api/cameraRequest";
import { useCookies } from "react-cookie";

type CameraSegmentProps = {
  cameraIP: string;
  password: string;
  userName: string;
  setCameraIP: (text: string) => void;
  applySettings: any;
  isEnabled: boolean;
  cameraName: string;
  setUserName: (text: string) => void;
  setCameraName: (text: string) => void;
  setPassword: (text: string) => void;
  editMode?: boolean;
};

const CameraSegment: React.FC<CameraSegmentProps> = ({
  cameraIP,
  password,
  userName,
  setCameraIP,
  applySettings,
  isEnabled,
  cameraName,
  setUserName,
  setCameraName,
  setPassword,
  editMode = false,
}) => {
  const [isModalChangePassword, setIsModalChangePassword] = useState(false);
  const [findCameraList, setFindCameraList] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const selectCameraList: SelectItem[] = findCameraList.map((cameraIp: any) => {
    return {
      id: cameraIp,
      label: cameraIp,
      value: cameraIp,
    };
  });

  const handleSelectCamera = (selectedIP: string) => {
  setCameraIP(selectedIP);
};

  const showAddCameras = cameras => {
    findCamera(window.location.hostname)
      .then(response => {
        if (response.data && response.data.results) {
          const allCameras = response.data.results;
          const bufCreatedCameras = cameras.length > 0 ? cameras.map(e => e.id) : [];
          const resultCameras = allCameras.filter(value => {
            return !bufCreatedCameras.includes(value);
          });
          setFindCameraList(resultCameras);
        } else {
          setFindCameraList([]);
        }
      })
      .catch(error => console.log(error.message))
      .finally(() => setIsLoading(false));
  };

  const fetchCameras = () => {
    if (selectCameraList.length) return;
    setIsLoading(true);
    getSelectedCameras(window.location.hostname, cookies.token)
      .then(response => {
        let cameras = [];
        if (response.data.length > 0) {
          cameras = response.data.sort((a, b) => a.name.localeCompare(b.name));
        }
        showAddCameras(cameras);
      })
      .catch(console.log)
  };

   useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <div className={styles.cameraSegment}>
      <div className={styles.section}>
        <IonNote className={`ion-padding ${styles.sectionNote}`}>{t("camera.cameraSegment.connection")}</IonNote>
        {editMode ? (
          <InputReadonly label={t("camera.cameraSegment.cameraIp")} value={cameraIP} />
        ) : (
          <DynamicSelectInput
            label={t("camera.cameraSegment.cameraIp")}
            value={cameraIP || ""}
            placeholder={t("camera.cameraSegment.select")}
            selectList={selectCameraList}
            handleChange={handleSelectCamera}
            isLoading={isLoading}
          />
        )}

        <Input
          label={t("camera.cameraSegment.username")}
          value={userName}
          required
          handleChange={e => setUserName(e.target.value)}
          tooltip={t("camera.cameraSegment.usernameTooltip")}
          zIndex={2}
        />
        <Input
          label={t("camera.cameraSegment.password")}
          value={password}
          type="password"
          //   hidePassword={editMode}
          required
          handleChange={e => setPassword(e.target.value)}
          tooltip={t("camera.cameraSegment.passwordTooltip")}
          zIndex={1}
          autocomplete="new-password"
        />
      </div>
      <div className={styles.section}>
        <IonNote className={`ion-padding ${styles.sectionNote}`}>{t("camera.cameraSegment.settings")}</IonNote>
        <Input
          label={t("camera.cameraSegment.displayedName")}
          value={cameraName}
          required={false}
          handleChange={e => setCameraName(e.target.value)}
          zIndex={0}
        />
        <CameraTest cameraIP={cameraIP} userName={userName} password={password} />
      </div>
    </div>
  );
};

export default CameraSegment;

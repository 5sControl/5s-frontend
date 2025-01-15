import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import {
  IonButton,
  IonContent,
  IonPage,
  IonToast,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import CameraSegment from "../../../components/cameraSegment/cameraSegment";
import { postAlgorithnDependences } from "../../../api/algorithmRequest";

const AddCamera = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<"camera" | "zone">("camera");

  const [cameraName, setCameraName] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [cameraIP, setCameraIP] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isNotification, setIsNotification] = useState(false);
  const [cameraSelect, setCameraSelect] = useState(false);
  const [isNotificationAfterCreate, setIsNotificationAfterCreate] = useState(false);


  const isBlank = !(cameraIP && userName && password);

  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  const navigateBack = () => {
    history.push(ROUTES.CAMERAS, { direction: "back" });
  };

  const openModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    navigateBack();
  };

  const handleConfirmModal = () => {
    setIsOpenModal(false);
    applySettings();
  };

  const handleSave = () => {
    setIsOpenModal(false);
    applySettings();
  };

  const applySettings = async () => {
    setLoading(true);
    const response: any = {
      camera: {
        ip: cameraIP,
        name: cameraName.length > 0 ? cameraName : cameraIP,
        username: userName,
        password: password,
      },
      algorithms: [],
    };

    await postAlgorithnDependences(window.location.hostname, cookies.token, response)
      .then(() => {
        setIsEnabled(false);
        setIsNotificationAfterCreate(false);
        setIsCameraSettings(false);
        navigateBack();
      })
      .catch(error => {
        console.log(error);
        setIsNotification(true);
      })
      .finally(() => {
        setLoading(false);
        setIsOpenModal(false);
      });
  };

  const setIsCameraSettings = (value: boolean) => {
    setCameraSelect(value);
  };

  return (
    <IonPage>
      <Header title={t("camera.configuration")} onBackClick={navigateBack} backButtonHref={ROUTES.USERS}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            {/* <div className="segment-wrapper ion-padding">
              <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                <IonSegmentButton value="camera">{t("camera.title")}</IonSegmentButton>
                <IonSegmentButton value="zone">{t("camera.zone")}</IonSegmentButton>
              </IonSegment>
            </div> */}

            <div>
              {/* {selectedSegment === "camera" && ( */}
              <CameraSegment
                cameraIP={cameraIP}
                setCameraIP={ip => setCameraIP(ip)}
                userName={userName}
                password={password}
                applySettings={applySettings}
                isEnabled={isEnabled}
                cameraName={cameraName}
                setUserName={name => setUserName(name)}
                setPassword={password => setPassword(password)}
                setCameraName={name => setCameraName(name)}
              />
              {/* )} */}
              {/* {selectedSegment === "zone" && <Zones cameraSelect={cameraSelect} isCreateCamera={isCreateCamera} />} */}
            </div>

            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage("")}
            />
            {selectedSegment === "camera" && (
              <IonButton className="ion-padding" expand="full" id="open-toast" onClick={handleSave} disabled={isBlank}>
                {t("operations.save")}
              </IonButton>
            )}
          </>
        )}
      </IonContent>
      <ConfirmationModal
        type="primary"
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        title={`${t("operations.saveChanges")}?`}
        confirmText={t("operations.save")}
        cancelText={t("operations.cancel")}
      />
    </IonPage>
  );
};

export default AddCamera;

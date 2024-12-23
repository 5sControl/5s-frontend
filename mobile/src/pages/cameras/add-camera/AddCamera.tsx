import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory} from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonButton, IonContent, IonPage, IonSegment, IonSegmentButton, IonText, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import CameraSegment from "../../../components/cameraSegment/cameraSegment";
import { findCamera, getSelectedCameras } from "../../../api/cameraRequest";
import { postAlgorithnDependences } from "../../../api/algorithmRequest";
import Zones from "../../../components/zoneSegment/zones/zones";
import { SelectItem } from "../../../models/types/selectItem";

const AddCamera = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<"camera" | "zone">("camera");

  const [cameraName, setCameraName] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [cameraIP, setCameraIP] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isNotification, setIsNotification] = useState(false);
  const [cameraSelect, setCameraSelect] = useState(false);
  const [isCreateCamera, setIsCreateCamera] = useState(false);
  const [findCameraList, setFindCameraList] = useState([]);
  const [isNotificationAfterCreate, setIsNotificationAfterCreate] = useState(false);
  const [createdCameras, setCreatedCameras] = useState<any>([]);
  const [error, setError] = useState(false);

  useIonViewWillEnter(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        let cameras = [];
        if (response.data.length > 0) {
          cameras = response.data.sort((a, b) => a.name.localeCompare(b.name));
          setCreatedCameras(cameras);
        }
        showAddCameras(cameras);
      })
      .catch((error) => setError(error.message))
  });
  
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

  const showAddCameras = (cameras) => {
    findCamera(window.location.hostname)
      .then((response) => {
        if (response.data && response.data.results) {
          const allCameras = response.data.results;
          const bufCreatedCameras = cameras.length > 0 ? cameras.map((e) => e.id) : [];
          const resultCameras = allCameras.filter((value) => {
            return !bufCreatedCameras.includes(value);
          });
          setFindCameraList(resultCameras);
        } else {
          setFindCameraList([]);
        }
      })
      .catch((error) => console.log(error.message))
      .finally(() => setLoading(false));
    setIsCreateCamera(true);
    setCameraSelect(true);
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
    // for (const algorithm of informationToSend) {
    //   if (algorithm === 'operation_control') {
    //     response.algorithms = [
    //       ...response.algorithms,
    //       {
    //         name: algorithm,
    //         config: {
    //           operation_control_id: operationID,
    //         },
    //       },
    //     ];
    //   } else {
    //     response.algorithms = [
    //       ...response.algorithms,
    //       {
    //         name: algorithm,
    //         config: {
    //           zonesID: configAlgo[algorithm].map((e) => ({ id: e })),
    //         },
    //       },
    //     ];
    //   }
    // }

    await postAlgorithnDependences(window.location.hostname, cookies.token, response)
      .then(() => {
        setIsEnabled(false);
        setIsNotificationAfterCreate(false);
        setIsCameraSettings(false);
      })
      .catch((error) => {
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
  }

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
                <div className="segment-wrapper ion-padding">
                  <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                      <IonSegmentButton value="camera">
                        {t("camera.title")}
                      </IonSegmentButton>
                      <IonSegmentButton value="zone">
                        {t("camera.zone")}
                      </IonSegmentButton>
                  </IonSegment>
                </div>

                <div>
                    {selectedSegment === 'camera' && (
                        <CameraSegment 
                          cameraIP={cameraIP}
                          isCreateCamera={isCreateCamera}
                          cameraSelect={cameraSelect}
                          setCameraIP={(ip) => setCameraIP(ip)}
                          userName={userName}
                          password={password}
                          applySettings={applySettings}
                          isEnabled={isEnabled}
                          findCameraList={findCameraList}
                          cameraName={cameraName}
                          setUserName={(name) => setUserName(name)}
                          setPassword={(password) => setPassword(password)}
                          setCameraName={(name) => setCameraName(name)}
                        />
                    )}
                    {selectedSegment === 'zone' && (
                        <Zones cameraSelect={cameraSelect} isCreateCamera={isCreateCamera} />
                    )}
                </div>

                <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage("")}
                />

                <IonButton className="ion-padding" expand="full" id="open-toast" onClick={openModal}>
                  {t("operations.save")}
                </IonButton>
             
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

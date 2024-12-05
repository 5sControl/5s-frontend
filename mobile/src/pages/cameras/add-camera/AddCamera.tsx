import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { useHistory} from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../components/preloader/preloader";
import { IonContent, IonPage, IonSegment, IonSegmentButton, IonText, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import CameraSegment from "../../../components/cameraSegment/cameraSegment";
import { findCamera, getSelectedCameras } from "../../../api/cameraRequest";
import { postAlgorithnDependences } from "../../../api/algorithmRequest";

const AddCamera = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<"camera" | "zone">("camera");

  const [cameraName, setCameraName] = useState('');
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);
  const [processLocal, setProcess] = useState([]);
  const [informationToSend, setInformationToSend] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [operationID, setOperationID] = useState('');
  const [cameraIP, setCameraIP] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isNotification, setIsNotification] = useState(false);
  const [isPreloader, setIsPreloader] = useState(false);
  const [activeTab, setActiveTab] = useState('Camera');
  const [configAlgo, setConfigAlgo] = useState<any>({});
  const [checkboxAlgo, setCheckboxAlgo] = useState([]);
  const [algorithmsActive, setAlgorithmsActive] = useState([]);
  const [algoWorkzone, setAlgoWorkzone] = useState({});
  const [cameraSelect, setCameraSelect] = useState(false);
  const [isCreateCamera, setIsCreateCamera] = useState(false);
  const [findCameraList, setFindCameraList] = useState([]);
  const [isNotificationAfterCreate, setIsNotificationAfterCreate] = useState(false);
  const [createdCameras, setCreatedCameras] = useState<any>([]);
  const [error, setError] = useState(false);

  useIonViewWillEnter(() => {
    showAddCameras();
  });
  
  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((response) => {
        if (response.data.length > 0) {
          setCreatedCameras(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        }
      })
      .catch((error) => setError(error.message));
  }, [cameraSelect]);
  
  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  const navigateBack = () => {
    history.push(ROUTES.CAMERAS, { direction: "back" });
  };

  const handleSave = () => {
    console.log('handle save');
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
    handleSave();
  };

  const showAddCameras = () => {
    findCamera(window.location.hostname)
      .then((response) => {
        if (response.data && response.data.results) {
          const allCameras = response.data.results;
          const bufCreatedCameras = createdCameras.length > 0 ? createdCameras.map((e) => e.id) : [];
          const resultCameras = allCameras.filter((value) => {
            return !bufCreatedCameras.includes(value);
          });
          setFindCameraList(resultCameras);
        } else {
          setFindCameraList([]);
        }
      })
      .catch((error) => console.log(error.message));
    setIsCreateCamera(true);
    setCameraSelect(true);
  };

  const applySettings = async () => {
    setIsPreloader(true);
    const response: any = {
      camera: {
        ip: cameraIP,
        name: cameraName.length > 0 ? cameraName : cameraIP,
        username: userName,
        password: password,
      },
      algorithms: [],
    };
    for (const algorithm of informationToSend) {
      if (algorithm === 'operation_control') {
        response.algorithms = [
          ...response.algorithms,
          {
            name: algorithm,
            config: {
              operation_control_id: operationID,
            },
          },
        ];
      } else {
        response.algorithms = [
          ...response.algorithms,
          {
            name: algorithm,
            config: {
              zonesID: configAlgo[algorithm].map((e) => ({ id: e })),
            },
          },
        ];
      }
    }
    await postAlgorithnDependences(window.location.hostname, cookies.token, response)
      .then(() => {
        setIsEnabled(false);
        setIsNotificationAfterCreate(false);
        setIsCameraSettings(false);
        setIsPreloader(false);
      })
      .catch((error) => {
        console.log(error);
        setIsNotification(true);
        setIsPreloader(false);
      });
  };

  const setIsCameraSettings = (value: boolean) => {
    setCameraSelect(value);
  }

  return (
    <IonPage>
      <Header title="Конфигурация" onBackClick={navigateBack} backButtonHref={ROUTES.USERS}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
            <>
                {/* <Input 
                    label={t("users.lastName")} 
                    value={user?.last_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, last_name: event.target.value })}
                    state={highlightRequired && !user.last_name ? "error" : "neutral" }
                    errorMessage={t("form.required")}/>
                <Input 
                    label={t("users.firstName")} 
                    value={user?.first_name || ""} 
                    required 
                    handleChange={event => setUser({ ...user, first_name: event.target.value })}
                    state={highlightRequired && !user.first_name ? "error" : "neutral" }
                    errorMessage={t("form.required")}/>
                
                <Input 
                    label={t("users.password")} 
                    value={user.password} 
                    type="password" 
                    required 
                    handleChange={event => setUser({ ...user, password: event.target.value })}
                    state={highlightRequired && !user.password ? "error" : "neutral" }
                    errorMessage={t("form.required")}/>
                
                <IonList inset={true}>
                    <MenuListButton title={t("users.workplace")} handleItemClick={() => {}}/>
                </IonList>
                <Select value={!customRole ? t("users.role") : user.role} placeholder={!customRole ? t("users.role") : user.role} selectList={roles} handleChange={event => {
                    setUser({ ...user, role: event.target.value });
                    setCustomRole(true)}   
                }/> */}

                <div className="segment-wrapper ion-padding">
                  <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                      <IonSegmentButton value="camera">
                          Камера
                      </IonSegmentButton>
                      <IonSegmentButton value="zone">
                          Зона
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
                        // <ZoneSegment />
                        <div>zone</div>
                    )}
                </div>

                <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage("")}
                />

                <BottomButton
                handleClick={openModal}
                label={t("operations.save")}
              />
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

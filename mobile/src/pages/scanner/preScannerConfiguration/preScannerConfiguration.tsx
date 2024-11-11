import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useLocation, useHistory } from "react-router-dom";
import { OPERATION_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import ModalSave from "../../../components/modalSave/modalSave";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { IReference } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";

const PreScannerConfiguration: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [operations, setOperations] = useState<IProductOperation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<number>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    OPERATION_REQUEST.getOperations(setOperations, setLoading, setToastMessage);
  });

  const handleCheckboxChange = (id: number) => {
      setSelectedOperation(id);
  };
  const navigateTo = () => {
    history.push(ROUTES.MENU, {direction: "back" });
  };

  const handleSubmit = async () => {
    if (selectedOperation){
        setIsModalOpen(false);
        history.push(ROUTES.SCANNER_QR(selectedOperation.toString()));
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t("form.selectOperation")}
        onBackClick={navigateTo}
        backButtonHref="#"
      />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <IonList className="ion-padding">
              {operations.map(item => (
                <IonItem key={item.id}>
                  <IonLabel>{item.name}</IonLabel>
                  <IonCheckbox
                    style={{ "--border-radius": "none" }}
                    slot="end"
                    onIonChange={e => handleCheckboxChange(item.id)}
                    checked={selectedOperation === item.id}
                  />
                </IonItem>
              ))}
            </IonList>

            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} />
            <BottomButton
              handleClick={openModal}
              label={t("operations.save")}
              disabled={operations.length === 0}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PreScannerConfiguration;

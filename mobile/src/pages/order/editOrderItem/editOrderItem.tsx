import React, { useState, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonToast,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useParams, useHistory } from "react-router-dom";
import ModalSave from "../../../components/modalSave/modalSave";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import styles from "./EditOrderItem.module.scss";
import { OPERATION_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { isEquals } from "./../../../utils/helpers";
import { IOrders, IReference } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";

const EditOrderItem: React.FC = () => {
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const [order, setOrder] = useState<IOrders>({} as IOrders);
  const [operations, setOperations] = useState<IProductOperation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const initIds = useRef([] as number[]);

  useIonViewWillEnter(() => {
    if (!id) return;
    ORDER_REQUEST.getOrderById(parseInt(id, 10), setOrder, setLoading, setToastMessage);
    OPERATION_REQUEST.getOperations(setOperations, setLoading, setToastMessage);
  });

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsModalOpen(false);
    ORDER_REQUEST.updateOrder(parseInt(id), { ...order }, setLoading, setToastMessage, handleNavigate);
  };

  const handleNavigate = () => history.push(ROUTES.ORDER(id), { direction: "back" });

  const operationList = operations.map(operation => (
    <IonItem key={operation.id}>
      <IonLabel>{operation.name}</IonLabel>
      <IonCheckbox
        style={{ "--border-radius": "none" }}
        slot="end"
        onIonChange={e => handleCheckboxChange(operation.id, e.detail.checked)}
        checked={selectedIds.includes(operation.id)}
      />
    </IonItem>
  ));

  return (
    <IonPage>
      <Header
        title={`${t("operations.edit")} ${order?.name ? `"${order.name}"` : ""}`}
        backButtonHref={ROUTES.ORDER(id)}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <IonList className={`${styles.page} ion-padding`}>
              <IonList className={styles.list}>
                <IonLabel>{t("form.name")}</IonLabel>
                <IonText color="medium">{order.name}</IonText>
              </IonList>
              <IonList className={styles.list}>
                <IonLabel>{t("orders.operations")}</IonLabel>
                <IonList>{operationList}</IonList>
              </IonList>
            </IonList>
            <BottomButton
              handleClick={() => setIsModalOpen(true)}
              disabled={isEquals(selectedIds, initIds.current)}
              label={t("operations.save")}
            />

            <ModalSave
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleSubmit={handleSubmit}
            ></ModalSave>
            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditOrderItem;

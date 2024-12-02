import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonToast,
  IonLoading,
  IonFooter,
  IonText,
  useIonViewDidEnter,
  useIonViewWillEnter,
  IonModal,
  IonDatetime,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useParams, useHistory } from "react-router-dom";
import ModalSave from "../../../components/modalSave/modalSave";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import styles from "./editOrder.module.scss";
import { ITEM_REQUEST, OPERATION_REQUEST, ORDER_ITEM_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { isEquals } from "./../../../utils/helpers";
import { IOrders, IReference } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";
import { IItem } from "../../../models/interfaces/item.interface";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { formatDate, getCurrentDateTimeISO } from "../../../utils/parseInputDate";
import { Input } from "../../../components/inputs/input/Input";
import InputDate from "../../../components/inputs/inputDate/inputDate";
import DateSelector from "../../../components/dateSelector/DateSelector";

const EditOrder: React.FC = () => {
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const [order, setOrder] = useState<IOrders>({} as IOrders);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orderName, setOrderName] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  const dateModalRef = useRef<HTMLIonModalElement>(null);

  useIonViewWillEnter(() => {
    if (!id) return;
    ORDER_REQUEST.getOrderById(parseInt(id, 10), setOrder, setLoading, setToastMessage);
  });

  useEffect(() => {
    setOrderName(order.name);
    if (order.estimatedAt) {
      setOrderDate(order.estimatedAt);
    }
  }, [order]);

  const handleSubmit = async () => {
    setLoading(true);
    setIsModalOpen(false);
    setLoading(false);
    handleNavigate();
    ORDER_REQUEST.updateOrder(
      parseInt(id, 10),
      { ...order, name: orderName, estimatedAt: orderDate },
      setLoading,
      setToastMessage,
      handleNavigate
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDER(id), { direction: "back" });
  };

  return (
    <IonPage>
      <Header title={`${t("operations.edit")} ${order?.orderNumber}`} backButtonHref={ROUTES.ORDER(id)} />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <Input
              label={t("form.name")}
              value={orderName}
              required
              handleChange={e => setOrderName(e.detail.value!)}
            />
            <DateSelector
              label={t("orders.estimatedAt")}
              date={orderDate}
              modalRef={dateModalRef}
              setDate={setOrderDate}
            />
            <BottomButton handleClick={openModal} label={t("operations.save")} />
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

export default EditOrder;

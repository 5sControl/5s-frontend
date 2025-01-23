import React, { useState, useEffect, useRef } from "react";
import { IonPage, IonContent, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useParams, useHistory } from "react-router-dom";
import { ORDER_REQUEST } from "../../../dispatcher";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { IOrders } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";
import { Input } from "../../../components/inputs/input/Input";
import DateSelector from "../../../components/dateSelector/DateSelector";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getCurrentDateTimeISO } from "../../../utils/parseInputDate";
import { isInvalidText } from "../../../utils/isInvalidText";

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

  const isChanged = orderName !== order.name || orderDate !== order.estimatedAt;

  useIonViewWillEnter(() => {
    if (!id) return;
    ORDER_REQUEST.getOrderById(parseInt(id, 10), setOrder, setLoading, setToastMessage);
  });

  useEffect(() => {
    setOrderName(order.name);
    setOrderDate(order.estimatedAt);
  }, [order]);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const saveOrder = async () => {
    setLoading(true);
    setIsModalOpen(false);
    ORDER_REQUEST.updateOrder(
      parseInt(id, 10),
      { name: orderName, estimatedAt: orderDate },
      setLoading,
      setToastMessage,
      navigateTo
    );
  };

  const handleBackClick = () => {
    if (isChanged) {
      setIsModalOpen(true);
      return;
    }
    navigateTo();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigateTo();
  };

  const navigateTo = () => history.push(ROUTES.ORDER(id), { direction: "back" });

  return (
    <IonPage>
      <Header
        title={`${t("operations.edit")} ${order?.orderNumber}`}
        onBackClick={handleBackClick}
        backButtonHref={ROUTES.ORDER(id)}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <Input
              label={t("orders.name")}
              value={orderName}
              required
              handleChange={e => setOrderName(e.detail.value!)}
              state={isInvalidText(orderName, {numbers: true, spaces: true}) ? "error" : "neutral"}
              errorMessage={t("form.invalidCharacters")}
            />
            <DateSelector
              label={t("orders.estimatedAt")}
              date={orderDate}
              modalRef={dateModalRef}
              setDate={setOrderDate}
              minDate={getCurrentDateTimeISO()}
            />

            <BottomButton 
              handleClick={openModal} 
              disabled={!(isChanged && !isInvalidText(orderName, {numbers: true, spaces: true}))} 
              label={t("operations.save")} />

            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />

            <ConfirmationModal
              type="primary"
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={saveOrder}
              title={`${t("operations.saveChanges")}?`}
              confirmText={t("operations.save")}
              cancelText={t("operations.cancel")}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditOrder;

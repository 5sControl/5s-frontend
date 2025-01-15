import React, { useRef, useState } from "react";
import { IonContent, IonLoading, IonPage, IonToast } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useHistory } from "react-router-dom";
import { ORDER_REQUEST } from "../../../dispatcher";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { Input } from "../../../components/inputs/input/Input";
import BottomButton from "../../../components/bottomButton/BottomButton";
import DateSelector from "../../../components/dateSelector/DateSelector";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { getCurrentDateTimeISO } from "../../../utils/parseInputDate";
import { isInvalidText } from "../../../utils/isInvalidText";

const AddOrder: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderName, setOrderName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [estimatedAt, setEstimatedAt] = useState<string>("");
  const [highlightError, setHighlightError] = useState<boolean>(false);
  const [orderExist, setOrderExist] = useState<boolean>(false);
  const estimatedModalRef = useRef<HTMLIonModalElement>(null);

  const navigateTo = () => {
    history.push(ROUTES.ORDERS, { direction: "back" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigateTo();
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    setLoading(true);
    ORDER_REQUEST.addOrder(
      { orderNumber: parseInt(orderNumber), name: orderName, ...(estimatedAt && { estimatedAt }) },
      setLoading,
      setToastMessage,
      () => {}
    )
      .then((res: any) => {
        setOrderName("");
        setOrderNumber("");
        setEstimatedAt("");
        setOrderExist(false);
        setHighlightError(false);
        navigateTo();
      })
      .catch((err) => {
        setOrderExist(true);
        setHighlightError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBackClick = () => {
    if (orderNumber) {
      setIsModalOpen(true);
      return;
    }
    navigateTo();
  };

  return (
    <IonPage color="light">
      <Header title={t("orders.newOrder")} onBackClick={handleBackClick} backButtonHref={ROUTES.ORDERS} />
      <IonContent>
        <IonLoading isOpen={isLoading} />
        <Input
          label={t("orders.orderNumber")}
          value={orderNumber}
          required={true}
          handleChange={e => setOrderNumber(e.detail.value)}
          type="number"
          state={highlightError && (orderNumber.length > 10 || orderExist) ? "error" : "neutral"}
          errorMessage={orderExist ? t("orders.orderExist") : t("messages.validLength")}
        />
        <Input
          label={t("orders.orderName")}
          value={orderName}
          required={true}
          handleChange={e => setOrderName(e.detail.value!)}
          maxLength={50}
          state={orderName.length === 50 || isInvalidText(orderName, {numbers: true, spaces: true}) ? "error" : "neutral"}
          errorMessage={orderName.length === 50 ? t("messages.validLength") : t("form.invalidCharacters")}
        />
        <DateSelector
          label={t("orders.estimatedAt")}
          date={estimatedAt}
          modalRef={estimatedModalRef}
          setDate={setEstimatedAt}
          minDate={getCurrentDateTimeISO()}
        />
        <BottomButton
          handleClick={handleSubmit}
          disabled={!orderNumber || orderNumber.length > 10 || orderName.length === 50 || isInvalidText(orderName, {numbers: true, spaces: true})}
          label={t("operations.save")}
        />
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
          onConfirm={handleSubmit}
          title={`${t("operations.saveChanges")}?`}
          confirmText={t("operations.save")}
          cancelText={t("operations.cancel")}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddOrder;

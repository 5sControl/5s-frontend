import React, { useState, useRef, useEffect } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonLabel,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
  IonToast,
  IonIcon,
  IonPage,
  IonFooter,
  IonList,
  IonLoading,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import InputDate from "../../../components/inputs/inputDate/inputDate";
import {
  formatDate,
  getTimeDifference,
  mergeDateAndTime,
  updateTimeInDate,
  getCurrentDateTimeISO,
  extractTime,
} from "./../../../utils/parseInputDate";
import { ITEM_REQUEST, OPERATION_REQUEST, ORDER_REQUEST, TIMESPAN_REQUEST } from "./../../../dispatcher";
import ModalSave from "../../../components/modalSave/modalSave";
import style from "./style.module.scss";
import { Back } from "./../../../assets/svg/SVGcomponent";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Header } from "../../../components/header/Header";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { IOrders } from "../../../models/interfaces/orders.interface";
import { IItem } from "../../../models/interfaces/item.interface";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { Preloader } from "../../../components/preloader/preloader";

const NewTimespan: React.FC = () => {
  const { orderId, itemId, operationId } = useParams<{ orderId: string; itemId: string; operationId: string }>();
  const [order, setOrder] = useState<IOrders>({} as IOrders);
  const [operation, setOperation] = useState<IProductOperation>({} as IProductOperation);
  const [item, setItem] = useState<IItem>({} as IItem);
  const [isDateChange, setIsDateChange] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>(getCurrentDateTimeISO());
  const [isStart, setIsStart] = useState<boolean>(false);
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();

  useIonViewWillEnter(() => {
    ORDER_REQUEST.getOrderById(parseInt(orderId, 10), setOrder, setLoading, setToastMessage)
      .then(() => ITEM_REQUEST.getItemById(parseInt(itemId, 10), setItem, setLoading, setToastMessage))
      .then(() =>
        OPERATION_REQUEST.getOperationById(parseInt(operationId, 10), setOperation, setLoading, setToastMessage)
      );
  });

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleStartNow = () => {
    setStartDateTime(updateTimeInDate(startDateTime));
    setIsStart(true);
  };

  const handleFinishNow = () => {
    setFinishDateTime(updateTimeInDate(getCurrentDateTimeISO()));
    openModal();
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDER_OPERATION(String(orderId), String(itemId), String(operationId)), { direction: "back" });
    setIsSaveModalOpen(false);
  };

  const handleSave = () => {
    if (!startDateTime) {
      showToastMessage(t("messages.validDate"));
    } else {
      setSave(true);
      const payload = {
        orderOperationId: parseInt(operationId),
        startedAt: startDateTime,
        ...(finishDateTime && { finishedAt: finishDateTime }),
      };
      operationId && TIMESPAN_REQUEST.addTimespan(payload, setLoading, setToastMessage, handleNavigate);
      setIsModalOpen(false);
      setIsStart(false);
      setFinishDateTime("");
    }
  };

  const handleStartDateChange = (date: string | string[]) => {
    if (Array.isArray(date)) return;
    if (finishDateTime) {
      setFinishDateTime(mergeDateAndTime(date, finishDateTime));
    }
    setStartDateTime(date);
  };

  const handleCustomTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;
    if (finishDateTime && time > finishDateTime) {
      setToastMessage(t("messages.startTime"));
      return;
    }
    setStartDateTime(time);
  };
  const handleCustomFinishTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;

    if (time < startDateTime) {
      setToastMessage(t("messages.finishDate"));
      return;
    }
    setFinishDateTime(time);
  };

  useEffect(() => {
    isSave && setSave(false);
  }, [finishDateTime, startDateTime]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const backClick = () => {
    if (isSave || (!isStart && !finishDateTime)) {
      handleNavigate();
    } else {
      setIsSaveModalOpen(true);
    }
  };

  const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t("orders.implementationTime")}
        backButtonHref={ROUTES.ORDER_OPERATION(String(orderId), String(itemId), String(operationId))}
        onBackClick={backClick}
      />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <InputReadonly label={t("orders.order")} value={order.name} />
            <InputReadonly label={t("orders.orderItem")} value={item.name} />
            <InputReadonly label={t("orders.operation")} value={operation.name} />
            <IonList className={`${style.page} ion-padding`}>
              <IonList className={style.list}>
                <IonLabel className={style.label}>{t("form.date")}</IonLabel>
                <InputDate value={formatDate(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
              </IonList>
              <IonList className={style.sized}>
                <div className={style.container}>
                  <IonLabel className={style.label}>{t("orders.startOperation")}</IonLabel>
                  {isStart && (
                    <IonButton
                      size="small"
                      fill="outline"
                      className="outlined"
                      style={{ fontWeight: "700", fontSize: "1rem" }}
                      onClick={() => startModalRef.current?.present()}
                    >
                      {extractTime(startDateTime)}
                    </IonButton>
                  )}
                </div>

                <IonModal isOpen={isDateChange} onDidDismiss={() => setIsDateChange(false)}>
                  <IonDatetime
                    presentation="date"
                    value={startDateTime}
                    onIonChange={e => handleStartDateChange(e.detail.value!)}
                  />
                </IonModal>

                <IonModal trigger="start-datetime" keepContentsMounted={true} style={{ display: "none" }}>
                  <IonDatetime
                    id="start-datetime"
                    presentation="time"
                    value={startDateTime}
                    onIonChange={e => handleCustomTime(e.detail.value!)}
                  />
                </IonModal>

                <IonModal ref={startModalRef}>
                  <IonDatetime
                    id="start-datetime"
                    presentation="time"
                    value={startDateTime}
                    onIonChange={e => handleCustomTime(e.detail.value!)}
                  />
                </IonModal>

                {!isStart && (
                  <IonButton expand="block" onClick={handleStartNow} disabled={isStart}>
                    {t("operations.start")}
                  </IonButton>
                )}
              </IonList>

              <IonList className={style.sized}>
                <div className={style.container}>
                  <IonLabel className={style.label}>{t("orders.finishOperation")}</IonLabel>
                  {finishDateTime && (
                    <IonButton
                      size="small"
                      fill="outline"
                      className="outlined"
                      style={{ fontWeight: "700", fontSize: "1rem" }}
                      onClick={() => finishModalRef.current?.present()}
                    >
                      {extractTime(finishDateTime)}
                    </IonButton>
                  )}
                </div>

                <IonModal trigger="finish-datetime" keepContentsMounted={true} style={{ display: "none" }}>
                  <IonDatetime
                    id="finish-datetime"
                    presentation="time"
                    value={finishDateTime || undefined}
                    onIonChange={e => handleCustomFinishTime(e.detail.value!)}
                  />
                </IonModal>
                <IonModal ref={finishModalRef}>
                  <IonDatetime
                    id="finish-datetime"
                    presentation="time"
                    value={finishDateTime || undefined}
                    onIonChange={e => handleCustomFinishTime(e.detail.value!)}
                  />
                </IonModal>

                {!finishDateTime && (
                  <IonButton expand="block" onClick={handleFinishNow} disabled={!isStart || !!finishDateTime}>
                    {t("operations.finish")}
                  </IonButton>
                )}
              </IonList>
              <div className={style.time}>
                <IonLabel className={style.label}> {t("orders.operationTime")}</IonLabel>
                <IonLabel className={style.timeLabel}>{`${hours}${t("time.hour")} ${
                  minutes ? minutes + " " + t("time.min") : ""
                }`}</IonLabel>
              </div>
              <IonToast
                position="top"
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage(null)}
              />
            </IonList>
            {/* <BottomButton handleClick={openModal} disabled={isSave || !isStart} label={t("operations.save")} /> */}
            <IonModal initialBreakpoint={1} breakpoints={[0, 1]} isOpen={isModalOpen} onWillDismiss={handleSave}>
              <div className={style.modalContainer}>
                <IonLabel className={style.modalTitle}>{`${t("text.finishedIn")} ${hours}${t("time.hour")} ${
                  minutes ? minutes + " " + t("time.min") : ""
                }`}</IonLabel>
                <IonLabel className={style.modalDescription}>{`${t("text.startOfOperation")}: ${extractTime(
                  startDateTime
                )}`}</IonLabel>
                <IonLabel className={style.modalDescription}>{`${t("text.endOfOperation")}: ${extractTime(
                  finishDateTime
                )}`}</IonLabel>
              </div>
            </IonModal>
            <ConfirmationModal
              type="primary"
              isOpen={isSaveModalOpen}
              onClose={handleNavigate}
              onConfirm={handleSave}
              title={`${t("operations.saveChanges")}?`}
              confirmText={t("operations.save")}
              cancelText={t("operations.cancel")}
            />
            {/* <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSave}></ModalSave> */}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NewTimespan;

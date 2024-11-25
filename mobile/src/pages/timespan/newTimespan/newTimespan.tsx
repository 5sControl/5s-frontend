import React, { useState, useRef, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonLabel,
  IonModal,
  IonToast,
  IonPage,
  IonList,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useLocation, useParams } from "react-router";
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
import style from "./style.module.scss";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { Header } from "../../../components/header/Header";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { IOrders } from "../../../models/interfaces/orders.interface";
import { IItem } from "../../../models/interfaces/item.interface";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import { Preloader } from "../../../components/preloader/preloader";
import { LocationState } from "../../../models/types/locationState";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

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
  const [isLoading, setLoading] = useState(false);
  const [qrOrderName, setQrOrderName] = useState<string>("");
  const [qrOrderYear, setQrOrderYear] = useState<string>("");
  const [qrOrderItem, setQrOrderItem] = useState<string>("");
  const history = useHistory();
  const location = useLocation<LocationState>();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();
  const qrTimespan = useSelector((state: RootState) => state.currentTimespan);

  const { from } = location.state || { from: "" };

  useIonViewWillEnter(() => {
    console.log(qrTimespan);
    if (qrTimespan) {
      const { orderName, orderYear, orderItem } = qrTimespan;
      setQrOrderName(orderName || "");
      setQrOrderYear(orderYear || "");
      setQrOrderItem(orderItem || "");
    } else {
      ORDER_REQUEST.getOrderById(parseInt(orderId, 10), setOrder, setLoading, setToastMessage)
        .then(() => ITEM_REQUEST.getItemById(parseInt(itemId, 10), setItem, setLoading, setToastMessage))
        .then(() =>
          OPERATION_REQUEST.getOperationById(parseInt(operationId, 10), setOperation, setLoading, setToastMessage)
        );
    }
  });

  const showToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const handleStartNow = () => {
    setStartDateTime(updateTimeInDate(startDateTime));
    setIsStart(true);
  };

  const handleFinishNow = () => {
    setFinishDateTime(updateTimeInDate(getCurrentDateTimeISO()));
    // openModal();
  };

  const handleNavigate = () => {
    // if (from === "scanner")
    history.push(ROUTES.SCANNER_QR);
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

  const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime);

  // Block navigation
  useEffect(() => {
    const unblock = history.block(location => {
      if (isStart) {
        return false;
      }
    });

    return () => {
      unblock();
    };
  }, [history, isStart]);

  return (
    <IonPage>
      <Header title={t("orders.implementationTime")} backButtonHref={isStart ? "" : ROUTES.SCANNER_QR} />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <InputReadonly label={t("orders.orderName")} value={qrOrderName || order.name} />
            <InputReadonly label={t("orders.orderYear")} value={qrOrderYear || "-"} />
            <InputReadonly label={t("orders.orderItem")} value={qrOrderItem || item.name} />
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

              {finishDateTime && (
                <IonButton expand="block" onClick={handleSave}>
                  {t("text.startNewOperation")}
                </IonButton>
              )}
              <IonToast
                position="top"
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage(null)}
              />
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NewTimespan;

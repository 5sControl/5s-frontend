import React, { useState, useRef, useEffect } from "react";
import { IonButton, IonContent, IonLabel, IonToast, IonPage, IonList, useIonViewWillEnter } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import InputDate from "../../../components/inputs/inputDate/inputDate";
import { formatDate, getTimeDifference, getCurrentDateTimeISO, formatISOBeforeSend } from "./../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "./../../../dispatcher";
import style from "./style.module.scss";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import { Header } from "../../../components/header/Header";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { Preloader } from "../../../components/preloader/preloader";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import TimeSelector from "../../../components/timeSelector/TimeSelector";

const NewTimespan: React.FC = () => {
  const { orderId, itemId, operationId } = useParams<{ orderId: string; itemId: string; operationId: string }>();
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  const [startDateTime, setStartDateTime] = useState<string>(getCurrentDateTimeISO());
  const [isStart, setIsStart] = useState<boolean>(false);
  const [block, setBlock] = useState<boolean>(false);
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [qrOrderName, setQrOrderName] = useState<string>("");
  const [qrOrderYear, setQrOrderYear] = useState<string>("");
  const [qrOrderItem, setQrOrderItem] = useState<string>("");
  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();
  const qrTimespan = useSelector((state: RootState) => state.currentTimespan);

  useIonViewWillEnter(() => {
    if (qrTimespan) {
      const { orderName, orderYear, orderItem } = qrTimespan;
      setQrOrderName(orderName || "");
      setQrOrderYear(orderYear || "");
      setQrOrderItem(orderItem || "");
    }
  });

  const handleStartNow = () => {
    setStartDateTime(getCurrentDateTimeISO());
    setIsStart(true);
    setBlock(true);
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(getCurrentDateTimeISO()),
    };
    operationId && TIMESPAN_REQUEST.addTimespan(payload, setTimespan, setLoading, setToastMessage);
  };

  const handleFinishNow = () => {
    setFinishDateTime(getCurrentDateTimeISO());
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(startDateTime),
      finishedAt: formatISOBeforeSend(getCurrentDateTimeISO()),
    };
    setBlock(false);
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage);
  };

  const handleStartTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;
    if (finishDateTime && time > finishDateTime) {
      setToastMessage(t("messages.startTime"));
      return;
    }
    setStartDateTime(time);
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(time),
      ...(finishDateTime && { finishedAt: formatISOBeforeSend(finishDateTime) }),
    };
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage);
  };

  const handleFinishTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;

    if (time < startDateTime) {
      setToastMessage(t("messages.finishDate"));
      return;
    }
    setFinishDateTime(time);
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(startDateTime),
      finishedAt: formatISOBeforeSend(time),
    };
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage);
  };

  const handleSave = () => {
    setFinishDateTime("");
    setIsStart(false);
    history.push(ROUTES.SCANNER_QR);
  };

  const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime);

  // Block navigation
  useEffect(() => {
    const unblock = history.block(location => {
      if (block) {
        return false;
      }
    });

    return () => {
      unblock();
    };
  }, [history, block]);

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
            <InputReadonly label={t("orders.orderName")} value={qrOrderName || "-"} />
            <InputReadonly label={t("orders.orderYear")} value={qrOrderYear || "-"} />
            <InputReadonly label={t("orders.orderItem")} value={qrOrderItem || "-"} />
            <IonList className={`${style.page} ion-padding`}>
              <IonList className={style.list}>
                <IonLabel className={style.label}>{t("form.date")}</IonLabel>
                <InputDate value={formatDate(startDateTime)} />
              </IonList>
              <IonList className={style.sized}>
                <div className={style.container}>
                  <IonLabel className={style.label}>{t("orders.startOperation")}</IonLabel>
                  {isStart && <TimeSelector time={startDateTime} modalRef={startModalRef} setTime={handleStartTime} />}
                </div>

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
                    <TimeSelector time={finishDateTime} modalRef={finishModalRef} setTime={handleFinishTime} />
                  )}
                </div>

                {!finishDateTime && (
                  <IonButton expand="block" onClick={handleFinishNow} disabled={!isStart || !!finishDateTime}>
                    {t("operations.finish")}
                  </IonButton>
                )}
              </IonList>
              <div className={style.time}>
                <IonLabel className={style.label}> {t("orders.operationTime")}</IonLabel>
                <IonLabel className={style.timeLabel}>{`${hours} ${t("time.hour")} ${
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

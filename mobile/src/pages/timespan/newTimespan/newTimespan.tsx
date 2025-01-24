import React, { useState, useRef, useEffect, SetStateAction } from "react";
import { IonButton, IonContent, IonLabel, IonToast, IonPage, IonList, useIonViewWillEnter } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import InputDate from "../../../components/inputs/inputDate/inputDate";
import { formatDate, getTimeDifference, getCurrentDateTimeISO, formatISOBeforeSend, formatTime } from "./../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "./../../../dispatcher";
import style from "./style.module.scss";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY_LONG } from "./../../../constants/toastDelay";
import { Header } from "../../../components/header/Header";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { Preloader } from "../../../components/preloader/preloader";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import TimeSelector from "../../../components/timeSelector/TimeSelector";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const NewTimespan: React.FC = () => {
  const { orderId, itemId, operationId } = useParams<{ orderId: string; itemId: string; operationId: string }>();
  const [block, setBlock] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();
  const [cookies] = useCookies();
  const {orderName, orderYear, orderItem} = useSelector((state: RootState) => state.currentTimespan);
  const [timespans, setTimespans] = useState<ITimespan[] | undefined>(undefined);
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  const [backLink, setBackLink] = useState(!!timespan.startedAt);
  
  const startDateTime = timespan.startedAt ?? getCurrentDateTimeISO();
  const finishDateTime = timespan.finishedAt;
  const isStart = !!timespan.startedAt;

  useEffect(() => {
    if (!timespans) return;
    if (timespans[0] && !timespans[0].finishedAt) {
      setTimespan(timespans[0]);
    }  else if (!orderName) {
      history.push(ROUTES.SCANNER_QR);
    }
  }, [timespans]); 

  useIonViewWillEnter(() => {
    const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
    const userId = Number(token.user_id);
    TIMESPAN_REQUEST.getTimespansByEmployee(userId, setTimespans as React.Dispatch<SetStateAction<ITimespan[]>>, setLoading, setToastMessage)
  });

  const handleStartNow = () => {
    setTimespan(timespan => ({
      ...timespan,
      startedAt: getCurrentDateTimeISO(),
    }));
    setBackLink(false);
    setBlock(true);
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(getCurrentDateTimeISO()),
    };
    operationId && TIMESPAN_REQUEST.addTimespan(payload, setTimespan, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
  };

  const handleFinishNow = () => {
    setTimespan(timespan => ({
      ...timespan,
      finishedAt: getCurrentDateTimeISO(),
    }));
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(startDateTime),
      finishedAt: formatISOBeforeSend(getCurrentDateTimeISO()),
    };
    setBlock(false);
    setBackLink(true);
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
  };

  const handleStartTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;
    const currentDateTime = getCurrentDateTimeISO();

    if (time > currentDateTime){
      setToastMessage(t("messages.timespanLimit"));
      return;
    }

    if (finishDateTime && time > finishDateTime) {
      setToastMessage(t("messages.startTime")); 
      return;
    }

    setTimespan(timespan => ({
      ...timespan,
      startedAt: time,
    }));
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(time),
      ...(finishDateTime && { finishedAt: formatISOBeforeSend(finishDateTime) }),
    };
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
  };

  const handleFinishTime = (time: string | string[]) => {
    if (Array.isArray(time)) return;
    const currentDateTime = getCurrentDateTimeISO();

    if (time < startDateTime) {
      setToastMessage(t("messages.finishDate"));
      return;
    }

    if (time > currentDateTime){
      setToastMessage(t("messages.timespanLimit"));
      return;
    }
    setTimespan(timespan => ({
      ...timespan,
      finishedAt: time,
    }));
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(startDateTime),
      finishedAt: formatISOBeforeSend(time),
    };
    operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
  };

  const handleSave = () => {
    history.push(ROUTES.SCANNER_QR);
  };

  const seconds = getTimeDifference(finishDateTime ?? getCurrentDateTimeISO(), startDateTime);
  const { hours, minutes } = formatTime(seconds);

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
      <Header title={t("orders.implementationTime")} backButtonHref={!backLink ? "" : ROUTES.MENU} />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <InputReadonly label={t("orders.orderName")} value={timespan?.orderOperation?.orderItem?.order?.name || orderName || "-"} />
            <InputReadonly label={t("orders.orderYear")} value={String(timespan?.orderOperation?.orderItem?.order?.orderYear || orderYear || "-")} />
            <InputReadonly label={t("orders.orderItem")} value={timespan?.orderOperation?.orderItem?.name || orderItem || "-"} />
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
                duration={TOAST_DELAY_LONG}
                onDidDismiss={() => setToastMessage(null)}
                buttons={[
                  {
                    text: t("operations.dismiss"),
                    role: 'cancel',
                    handler: () => {
                      setToastMessage(null);
                    },
                  },
                ]}
              />
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NewTimespan;
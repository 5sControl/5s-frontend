import React, { useState, useRef, useEffect } from "react";
import {
  IonIcon,
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
  IonPage,
  IonFooter,
  IonList,
  IonLoading,
  useIonViewDidEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import InputDate from '../../../components/inputs/inputDate/inputDate';
import {
  formatDateUTC,
  getTimeDifference,
  mergeDateAndTime,
  formatYMD,
  getCurrentDateTimeISO,
} from "./../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "./../../../dispatcher";
import style from "./styles.module.scss";
import { ITimespan } from "./../../../models/interfaces/orders.interface";
import ModalSave from "../../../components/modalSave/modalSave";
import { Back } from "./../../../assets/svg/SVGcomponent";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Header } from "../../../components/header/Header";
const RADIX = 10;

const EditTimespan: React.FC = () => {
  const { t } = useTranslation();
  const { timespanId, id, operationId } = useParams<{ timespanId: string; id: string; operationId: string }>();
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  const [isDateChange, setIsDateChange] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [isStart, setIsStart] = useState<boolean>(true);
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);

  const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime);

  useIonViewDidEnter(() => {
    timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, RADIX), setTimespan, setLoading, setToastMessage);
  });

  useEffect(() => {
    if (timespan) {
      timespan.createdAt && setStartDateTime(formatYMD(timespan.startedAt));
      timespan.finishedAt && setFinishDateTime(formatYMD(timespan.finishedAt));
    }
  }, [timespan]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDER_OPERATION(String(id), String(operationId)), { direction: 'back' });
  };

  const handleSave = () => {
    if (!startDateTime) {
      showToastMessage(t("messages.validDate"));
    } else {
      timespanId &&
        TIMESPAN_REQUEST.updateTimespan(
          parseInt(timespanId),
          { startedAt: startDateTime, finishedAt: finishDateTime || "" },
          setLoading,
          setToastMessage,
          handleNavigate
        );
      setSave(true);
      setIsModalOpen(false);
    }
  };

  const handleStartDateChange = (date: string | string[]) => {
    if (Array.isArray(date)) return;
    if (finishDateTime) {
      setFinishDateTime(mergeDateAndTime(date, finishDateTime));
    }
    setStartDateTime(date);
    setSave(false);
  };

  const handleCustomTime = (time: string | string[]) => {
    if (!startDateTime) setStartDateTime(getCurrentDateTimeISO());
    if (Array.isArray(time)) return;
    if (finishDateTime && time > finishDateTime) {
      setToastMessage(t("messages.startTime"));
      return;
    }
    setStartDateTime(time);
    setSave(false);
  };

  const handleCustomFinishTime = (time: string | string[]) => {
    if (!finishDateTime) setFinishDateTime(getCurrentDateTimeISO());
    if (Array.isArray(time)) return;
    if (time < startDateTime) {
      setToastMessage(t("messages.finishDate"));
      return;
    }
    setFinishDateTime(time);
    setSave(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleFinishNow = () => {
    setFinishDateTime(startDateTime);
    setSave(false);
  };

  const backClick = () => {
    if (isSave) {
      handleNavigate();
    } else {
      showToastMessage(t("messages.saveData"));
    }
  };

  return (
    <IonPage>
      <Header
        title={t("orders.implementationTime")}
        backButtonHref={ROUTES.ORDER_OPERATION(String(id), String(operationId))}
      />
      <IonLoading isOpen={isLoading} />
      <IonContent>
        {startDateTime && (
          <>
            <IonList className={`${style.page} ion-padding`}>
              <IonList className={style.list}>
                <IonLabel>{t("form.date")}</IonLabel>
                <InputDate value={formatDateUTC(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
              </IonList>
              <IonList className={style.sized}>
                <IonLabel>{t("orders.startOperation")}</IonLabel>
                <div className={style.container}>
                  {isStart ? (
                    <IonDatetimeButton datetime="start-datetime" slot="time-target" />
                  ) : (
                    <IonText className="ion-button-edit">{t("form.date")}</IonText>
                  )}
                  {isStart && (
                    <IonButton size="small" onClick={() => startModalRef.current?.present()}>
                      {t("operations.edit")}
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
                    value={startDateTime || undefined}
                    onIonChange={e => handleCustomTime(e.detail.value!)}
                  />
                </IonModal>

                <IonModal ref={startModalRef}>
                  <IonDatetime
                    id="start-datetime"
                    presentation="time"
                    value={startDateTime || undefined}
                    onIonChange={e => handleCustomTime(e.detail.value!)}
                  />
                </IonModal>

                <IonButton expand="block" disabled={true}>
                  {t("operations.start")}
                </IonButton>
              </IonList>

              <IonList className={style.sized}>
                <IonLabel>{t("orders.finishOperation")}</IonLabel>
                <div className={style.container}>
                  {finishDateTime ? (
                    <IonDatetimeButton datetime="finish-datetime" />
                  ) : (
                    <IonText className="ion-button-edit">{t("orders.date")}</IonText>
                  )}
                  {finishDateTime && (
                    <IonButton size="small" onClick={() => finishModalRef.current?.present()}>
                      {t("operations.edit")}
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

                <IonButton expand="block" onClick={handleFinishNow} disabled={!!finishDateTime}>
                  {t("operations.finish")}
                </IonButton>
              </IonList>
              <div className={style.time}>
                <IonLabel>{t("orders.operationTime")}</IonLabel>
                <IonLabel>{`${hours}${t("time.hour")} ${minutes ? minutes + " " + t("time.min") : ""}`}</IonLabel>
              </div>
              <IonToast
                position="top"
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage(null)}
              />
            </IonList>
            <BottomButton handleClick={openModal} disabled={isSave} label={t("operations.save")} />
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSave}></ModalSave>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditTimespan;

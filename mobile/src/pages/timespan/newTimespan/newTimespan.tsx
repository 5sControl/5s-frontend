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
} from "./../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "./../../../dispatcher";
import ModalSave from "../../../components/modalSave/modalSave";
import style from "./style.module.scss";
import { Back } from "./../../../assets/svg/SVGcomponent";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Header } from "../../../components/header/Header";

const NewTimespan: React.FC = () => {
  const { id, operationId } = useParams<{ id: string; operationId: string }>();
  const [isDateChange, setIsDateChange] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>(getCurrentDateTimeISO());
  const [isStart, setIsStart] = useState<boolean>(false);
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleStartNow = () => {
    setStartDateTime(updateTimeInDate(startDateTime));
    setIsStart(true);
  };

  const handleFinishNow = () => {
    setFinishDateTime(startDateTime);
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDER_OPERATION(String(id), String(operationId)), { direction: "back" });
  };

  const handleSave = () => {
    if (!startDateTime) {
      showToastMessage(t("messages.validDate"));
    } else {
      setSave(true);
      const payload = {
        startedAt: startDateTime,
        ...(finishDateTime && { finishedAt: finishDateTime }),
      };
      operationId &&
        TIMESPAN_REQUEST.addTimespan(parseInt(operationId), payload, setLoading, setToastMessage, handleNavigate);
      setIsModalOpen(false);
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

  const backClick = () => {
    if (isSave || (!isStart && !finishDateTime)) {
      handleNavigate();
    } else {
      showToastMessage(t("messages.saveData"));
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
        backButtonHref={ROUTES.ORDER_OPERATION(String(id), String(operationId))}
      />

      <IonContent>
        <IonList className={`${style.page} ion-padding`}>
          <IonList className={style.list}>
            <IonLabel>{t("form.date")}</IonLabel>
            <InputDate value={formatDate(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
          </IonList>
          <IonList className={style.sized}>
            <IonLabel>{t("orders.startOperation")}</IonLabel>
            <div className={style.container}>
              {isStart ? (
                <IonDatetimeButton
                  datetime="start-datetime"
                  slot="time-target"
                  onClick={e => {
                    e.preventDefault;
                  }}
                />
              ) : (
                <IonText className="ion-button-edit">{t("orders.date")}</IonText>
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

            <IonButton expand="block" onClick={handleStartNow} disabled={isStart}>
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

            <IonButton expand="block" onClick={handleFinishNow} disabled={!isStart || !!finishDateTime}>
              {t("operations.finish")}
            </IonButton>
          </IonList>
          <div className={style.time}>
            <IonLabel> {t("orders.operationTime")}</IonLabel>
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
        <BottomButton handleClick={openModal} disabled={isSave || !isStart} label={t("operations.save")} />
        <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSave}></ModalSave>
      </IonContent>
    </IonPage>
  );
};

export default NewTimespan;

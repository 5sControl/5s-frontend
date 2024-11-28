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
import { useParams } from "react-router";
import InputDate from "../../../components/inputs/inputDate/inputDate";
import {
  formatDateUTC,
  getTimeDifference,
  mergeDateAndTime,
  formatYMD,
  getCurrentDateTimeISO,
  extractTime,
  updateTimeInDate,
} from "./../../../utils/parseInputDate";
import { ITEM_REQUEST, OPERATION_REQUEST, ORDER_REQUEST, TIMESPAN_REQUEST } from "./../../../dispatcher";
import style from "./styles.module.scss";
import { IOrders, ITimespan } from "./../../../models/interfaces/orders.interface";
import ModalSave from "../../../components/modalSave/modalSave";
import { Back } from "./../../../assets/svg/SVGcomponent";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../../constants/toastDelay";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Header } from "../../../components/header/Header";
import { Preloader } from "../../../components/preloader/preloader";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import { IItem } from "../../../models/interfaces/item.interface";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const RADIX = 10;

const EditTimespan: React.FC = () => {
  const { t } = useTranslation();
  const { orderId, itemId, operationId, timespanId } = useParams<{
    orderId: string;
    itemId: string;
    operationId: string;
    timespanId: string;
  }>();
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  const [worker, setWorker] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isDateChange, setIsDateChange] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [isStart, setIsStart] = useState<boolean>(true);
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const qrTimespan = useSelector((state: RootState) => state.currentTimespan);

  const history = useHistory();
  const startModalRef = useRef<HTMLIonModalElement>(null);
  const finishModalRef = useRef<HTMLIonModalElement>(null);

  const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime);

  useIonViewWillEnter(() => {
    if (qrTimespan) {
      const { orderName, orderYear, orderItem, timespanWorker, timespanStatus } = qrTimespan;
      setWorker(timespanWorker || "");
      setStatus(timespanStatus || "");
      timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, RADIX), setTimespan, setLoading, setToastMessage);
    }
  });

  useEffect(() => {
    if (timespan) {
      timespan.startedAt && setStartDateTime(formatYMD(timespan.startedAt));
      timespan.finishedAt && setFinishDateTime(formatYMD(timespan.finishedAt));
    }
  }, [timespan]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDER_ITEM(String(orderId), String(itemId)), { direction: "back" });
    setIsSaveModalOpen(false);
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
    setFinishDateTime(updateTimeInDate(getCurrentDateTimeISO()));
    openModal();
    setSave(false);
  };

  const backClick = () => {
    if (isSave) {
      handleNavigate();
    } else {
      setIsSaveModalOpen(true);
    }
  };

  return (
    <IonPage>
      <Header
        title={t("orders.implementationTime")}
        backButtonHref={ROUTES.ORDER_ITEM(String(orderId), String(itemId))}
        onBackClick={backClick}
      />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            {startDateTime && (
              <>
                <InputReadonly label={t("orders.surname")} value={worker} />
                <InputReadonly label={t("orders.status")} value={status} />

                <IonList className={`${style.page} ion-padding`}>
                  <IonList className={style.list}>
                    <IonLabel className={style.label}>{t("form.date")}</IonLabel>
                    <InputDate value={formatDateUTC(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
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
                        value={startDateTime || undefined}
                        onIonChange={e => handleCustomTime(e.detail.value!)}
                      />
                    </IonModal>
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
                    <IonLabel className={style.label}>{t("orders.operationTime")}</IonLabel>
                    <IonLabel className={style.timeLabel}>{`${hours} ${t("time.hour")} ${
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
              </>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EditTimespan;

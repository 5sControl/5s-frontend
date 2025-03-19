import React, { useState, useRef, useEffect } from "react";
import { IonButton, IonContent, IonLabel, IonToast, IonPage, IonList, useIonViewWillEnter } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import {
  mergeDateAndTime,
  getCurrentDateTimeISO,
  formatISOBeforeSend,
  formatTime,
  parseToDate,
  parseToTime,
  getTimeDifference,
} from "../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "../../../dispatcher";
import style from "./styles.module.scss";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { Header } from "../../../components/header/Header";
import { Preloader } from "../../../components/preloader/preloader";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import TimeSelector from "../../../components/timeSelector/TimeSelector";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ROLE } from "../../../models/enums/roles.enum";
import { Camera } from "../../../assets/svg/SVGcomponent";
import DateSelector from "../../../components/dateSelector/DateSelector";
const RADIX = 10;

interface LocationState {
    orderName: string;
}

const EditTask: React.FC = () => {
  const { t } = useTranslation();
  const { orderId, itemId, operationId, timespanId } = useParams<{
    orderId: string;
    itemId: string;
    operationId: string;
    timespanId: string;
  }>();
  const location = useLocation<LocationState>();
  const {orderName} = location.state || "";
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  // const [isDateChange, setIsDateChange] = useState<boolean>(false);
  // const [startDateTime, setStartDateTime] = useState<string>("");
  const [durationTime, setDurationTime] = useState<number>(0);
  // const [isStart, setIsStart] = useState<boolean>(true);
  // const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const history = useHistory();
  // const startModalRef = useRef<HTMLIonModalElement>(null);
  // const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { hours, minutes } = formatTime(durationTime);
  const userRole = useSelector((state: RootState) => state.user.role);

  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [finishDate, setFinishDate] = useState<string>("");
  const [finishTime, setFinishTime] = useState<string>("");
  const startDateModalRef = useRef<HTMLIonModalElement>(null);
  const startTimeModalRef = useRef<HTMLIonModalElement>(null);
  const finishDateModalRef = useRef<HTMLIonModalElement>(null);
  const finishTimeModalRef = useRef<HTMLIonModalElement>(null);
  
  useIonViewWillEnter(() => {
    timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, RADIX), setTimespan, setLoading, setToastMessage);
  });

  useEffect(() => {
    // if (timespan) {
    //   timespan.startedAt && setStartDateTime(formatYMD(timespan.startedAt));
    //   timespan.finishedAt && setFinishDateTime(formatYMD(timespan.finishedAt));
    //   setDurationTime(timespan?.duration ?? null)
    // }
     if (timespan) {
          if (timespan.startedAt) {      
            setStartDate(parseToDate(timespan.startedAt));
            setStartTime(parseToTime(timespan.startedAt));
          }
          if (timespan.finishedAt) {
            setFinishDate(parseToDate(timespan.finishedAt));
            setFinishTime(parseToTime(timespan.finishedAt));
          }
          setDurationTime(timespan.duration ?? 0);
        }
  }, [timespan]);

  useEffect(() => {
      if (startDate && startTime && finishDate && finishTime) {
        const startISO = mergeDateAndTime(startDate, startTime);
        const finishISO = mergeDateAndTime(finishDate, finishTime);
        const diff = getTimeDifference(startISO, finishISO);
        setDurationTime(diff);
      }
    }, [startDate, startTime, finishDate, finishTime]);

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
    history.go(-1);
    setIsSaveModalOpen(false);
  };

  // const handleSave = () => {
  //   if (!startDateTime) {
  //     showToastMessage(t("messages.validDate"));
  //   } else {
  //     timespanId &&
  //       TIMESPAN_REQUEST.updateTimespan(
  //         parseInt(timespanId),
  //         { startedAt: formatISOBeforeSend(startDateTime), finishedAt: formatISOBeforeSend(finishDateTime) || "" },
  //         setLoading,
  //         setToastMessage,
  //         handleNavigate
  //       )
  //       .catch(() =>{
  //         setToastMessage(t("orders.timeOverlap"));
  //       });
  //     setSave(true);
  //     setIsModalOpen(false);
  //   }
  // };

   const handleSave = () => {
      if (!startDate) {
        showToastMessage("Please select a valid start date");
        return;
      }
      if (!startTime) {
        showToastMessage("Please select a valid start time");
        return;
      }
  
      const startedAt = formatISOBeforeSend(mergeDateAndTime(startDate, startTime));
      let finishedAt = "";
      if (finishDate && finishTime) {
        const startISO = mergeDateAndTime(startDate, startTime);
        const finishISO = mergeDateAndTime(finishDate, finishTime);
        if (finishISO < startISO) {
          showToastMessage("Finish cannot be earlier than Start");
          setIsSaveModalOpen(false);
          return;
        }
        finishedAt = formatISOBeforeSend(finishISO);
      }
      const nowISO = getCurrentDateTimeISO();
      if (startedAt > nowISO) {
        showToastMessage("Start date/time cannot be in the future");
        setIsSaveModalOpen(false);
        return;
      }
      if (finishedAt && finishedAt > nowISO) {
        showToastMessage("Finish date/time cannot be in the future");
        setIsSaveModalOpen(false);
        return;
      }
  
      if (timespanId) {
        TIMESPAN_REQUEST.updateTimespan(
          parseInt(timespanId, RADIX),
          { startedAt, finishedAt },
          setLoading,
          setToastMessage,
          handleNavigate
        )
        .then(() => {
          setSave(true);
          setIsModalOpen(false);
          handleNavigate();
        })
        .catch(() => {
          setToastMessage("Time overlaps with another timespan");
          setIsSaveModalOpen(false);
        });
      }
    };

    const handleFinishNow = () => {
        const nowISO = getCurrentDateTimeISO();
        setFinishDate(parseToDate(nowISO));
        setFinishTime(parseToTime(nowISO));
        setSave(false);
      };

  // const handleStartDateChange = (date: string | string[]) => {
  //   if (Array.isArray(date)) return;
  //   if (finishDateTime) {
  //     setFinishDateTime(mergeDateAndTime(date, finishDateTime));
  //   }
  //   setStartDateTime(date);
  //   setSave(false);
  // };

  // const handleStartTime = (time: string | string[]) => {
  //   if (!startDateTime) setStartDateTime(getCurrentDateTimeISO());
  //   if (Array.isArray(time)) return;
  //   if (finishDateTime && time > finishDateTime) {
  //     setToastMessage(t("messages.startTime"));
  //     return;
  //   }
  //   setStartDateTime(time);
  //   setSave(false);
  // };

  // const handleFinishTime = (time: string | string[]) => {
  //   if (!finishDateTime) setFinishDateTime(getCurrentDateTimeISO());
  //   if (Array.isArray(time)) return;
  //   if (time < startDateTime) {
  //     setToastMessage(t("messages.finishDate"));
  //     return;
  //   }
  //   setFinishDateTime(time);
  //   setSave(false);
  // };

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleFinishNow = () => {
  //   setFinishDateTime(updateTimeInDate(getCurrentDateTimeISO()));
  //   openModal();
  //   setSave(false);
  // };

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
        title={orderName}
        backButtonHref={ROUTES.ORDER_ITEM(String(orderId), String(itemId))}
        onBackClick={backClick}
        endButton={
          userRole !== ROLE.WORKER && (
            <img
              src={Camera}
              alt="camera"
              onClick={() =>
                history.push(ROUTES.ORDER_TIMESPAN_CAMERAS(orderId, itemId, operationId, timespanId))
              }
            />
          )
        }
      />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            {startDate && startTime && (
              <>
                <InputReadonly label={t("orders.orderNumber")} value={String(timespan.orderOperation.orderItem.order.orderNumber)} />
                <InputReadonly label={t("orders.orderYear")} value={String(timespan.orderOperation.orderItem.order.orderYear)} />
                <InputReadonly label={t("orders.orderItem")} value={String(timespan.orderOperation.orderItem.name)} />
                
                <IonList className={`${style.page} ion-padding`}>
                  {/* <IonList className={style.list}>
                    <IonLabel className={style.label}>{t("form.operationDate")}</IonLabel>
                    <InputDate value={formatDate(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
                  </IonList> */}
                  <IonList className={style.sized}>
                    <div className={style.container}>
                      <IonLabel className={style.label}>{t("orders.startOperation")}</IonLabel>
                      {/* {isStart && (
                        <TimeSelector time={startDateTime} modalRef={startModalRef} setTime={handleStartTime} />
                      )} */}
                       {startDate && startTime && (
                          <>
                          <DateSelector
                          label=""
                          date={startDate}
                          setDate={setStartDate}
                          modalRef={startDateModalRef}
                          time={false}
                          setSave={setSave}
                        />
                        <TimeSelector
                          time={startTime}
                          modalRef={startTimeModalRef}
                          setTime={setStartTime}
                          setSave={setSave}
                           />
                        </>
                       )}
                    </div>
                  </IonList>

                  <IonList className={style.sized}>
                    <div className={style.container}>
                    <IonLabel className={style.label}>{t("orders.finishOperation")}</IonLabel>
                      {/* {finishDateTime && (
                        <TimeSelector time={finishDateTime} modalRef={finishModalRef} setTime={handleFinishTime} />
                      )} */}
                     {finishDate && finishTime &&(
                       <>
                      <DateSelector
                        label=""
                        date={finishDate}
                        setDate={setFinishDate}
                        modalRef={finishDateModalRef}
                        time={false}
                        setSave={setSave}
                      />
                      <TimeSelector
                        time={finishTime}
                        modalRef={finishTimeModalRef}
                        setTime={setFinishTime}
                        setSave={setSave}
                         />
                      </>
                     )}
                    </div>

                    {!finishDate && !finishTime && (
                      <IonButton expand="block" onClick={handleFinishNow} disabled={!startTime && !startDate || !!finishDate && !!finishTime}>
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

                    {finishDate && finishTime && (
                      <IonButton expand="block" onClick={handleSave}>
                        {t("operations.save")}
                      </IonButton>
                    )}
                </IonList>

               <ConfirmationModal
                  type="primary"
                  isOpen={isSaveModalOpen}
                  onDismiss={() => setIsSaveModalOpen(false)}
                  onCancel={handleNavigate}
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

export default EditTask;

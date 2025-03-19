import React, { useState, useRef, useEffect, SetStateAction, useMemo } from "react";
import { IonButton, IonContent, IonLabel, IonToast, IonPage, IonList, useIonViewWillEnter } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
// import InputDate from "../../../components/inputs/inputDate/inputDate";
import { getTimeDifference, getCurrentDateTimeISO, formatISOBeforeSend, formatTime, getDateTimeISO, mergeDateAndTime, parseToDate, parseToTime } from "./../../../utils/parseInputDate";
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
import DateSelector from "../../../components/dateSelector/DateSelector";

const RADIX = 10;

const NewTimespan: React.FC = () => {
  const { orderId, itemId, operationId } = useParams<{ orderId: string; itemId: string; operationId: string }>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  // const startModalRef = useRef<HTMLIonModalElement>(null);
  // const finishModalRef = useRef<HTMLIonModalElement>(null);
  const { t } = useTranslation();
  const [cookies] = useCookies();
  const {orderName, orderYear, orderItem, orderOperation} = useSelector((state: RootState) => state.currentTimespan);
  const [timespans, setTimespans] = useState<ITimespan[] | undefined>(undefined);
  const [activeTimespan, setActiveTimespan] = useState<ITimespan>({} as ITimespan);
  // const [needSave, setNeedSave] = useState(false);

  const startDateTime = useMemo(() => 
    activeTimespan.startedAt ? getDateTimeISO(new Date(activeTimespan.startedAt)) : getCurrentDateTimeISO(),
    [activeTimespan.startedAt]
  );
  
  const finishDateTime = useMemo(() => 
    activeTimespan.finishedAt ? getDateTimeISO(new Date(activeTimespan.finishedAt)) : undefined,
    [activeTimespan.finishedAt]
  );
  const isStart = !!activeTimespan.startedAt;


  const [durationTime, setDurationTime] = useState<number>(getTimeDifference(finishDateTime ?? getCurrentDateTimeISO(), startDateTime));
  const [isSave, setSave] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [finishDate, setFinishDate] = useState<string>("");
  const [finishTime, setFinishTime] = useState<string>("");
  const startDateModalRef = useRef<HTMLIonModalElement>(null);
  const startTimeModalRef = useRef<HTMLIonModalElement>(null);
  const finishDateModalRef = useRef<HTMLIonModalElement>(null);
  const finishTimeModalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (!timespans) return;
    const active = timespans[0];
    if (active && !active.finishedAt) {
      setActiveTimespan(active);
      if (active.startedAt) {
        setStartDate(parseToDate(active.startedAt));
        setStartTime(parseToTime(active.startedAt));
      }
      if (active.finishedAt) {
        setFinishDate(parseToDate(active.finishedAt));
        setFinishTime(parseToTime(active.finishedAt));
      }
      setDurationTime(active.duration ?? 0);
    } else if (orderName) {
      setActiveTimespan({} as ITimespan);
    } else {
      history.push(ROUTES.SCANNER_QR);
    }
  }, [timespans]);
  

  useIonViewWillEnter(() => {
    const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
    const userId = Number(token.user_id);
    TIMESPAN_REQUEST.getTimespansByEmployee(userId, setTimespans as React.Dispatch<SetStateAction<ITimespan[]>>, setLoading, setToastMessage)
  });

  const handleStartNow = () => {
    const nowISO = getCurrentDateTimeISO();
    setActiveTimespan(timespan => ({
      ...timespan,
      startedAt: nowISO,
    }));
    setStartDate(parseToDate(nowISO));
    setStartTime(parseToTime(nowISO));
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(nowISO),
    };
    operationId && TIMESPAN_REQUEST.addTimespan(payload, setActiveTimespan, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
    setSave(false);
  };

  const handleFinishNow = () => {
    const nowISO = getCurrentDateTimeISO();
    setActiveTimespan(timespan => ({
      ...timespan,
      finishedAt: nowISO,
    }));
    setFinishDate(parseToDate(nowISO));
    setFinishTime(parseToTime(nowISO));
    const payload = {
      orderId: parseInt(orderId),
      orderOperationId: parseInt(operationId),
      startedAt: formatISOBeforeSend(mergeDateAndTime(startDate, startTime)),
      finishedAt: formatISOBeforeSend(nowISO),
    };
    operationId && TIMESPAN_REQUEST.updateTimespan(activeTimespan.timespanId, payload, setLoading, setToastMessage)
    .catch(() =>{
      setToastMessage(t("orders.timeOverlap"));
    });
    setSave(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (startDate && startTime) {
      if (finishDate && finishTime) {
        const startISO = mergeDateAndTime(startDate, startTime);
        const finishISO = mergeDateAndTime(finishDate, finishTime);
        const diff = getTimeDifference(startISO, finishISO);
        setDurationTime(diff);
      } else {
        const updateDuration = () => {
          const nowISO = getCurrentDateTimeISO();
          const startISO = mergeDateAndTime(startDate, startTime);
          const diff = getTimeDifference(startISO, nowISO);
          setDurationTime(diff);
        };
        updateDuration();
        interval = setInterval(updateDuration, 60000);
      }
    } else {
      setDurationTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startDate, startTime, finishDate, finishTime]);
  

  // const handleStartTime = (time: string | string[]) => {
  //   if (Array.isArray(time)) return;
  //   const currentDateTime = getCurrentDateTimeISO();

  //   if (time > currentDateTime){
  //     setToastMessage(t("messages.timespanLimit"));
  //     return;
  //   }

  //   if (finishDateTime && time > finishDateTime) {
  //     setToastMessage(t("messages.startTime")); 
  //     return;
  //   }

  //   const savedTime = startDateTime;
  //   setTimespan(timespan => ({
  //       ...timespan,
  //       startedAt: time,
  //   }));
  //   const payload = {
  //     orderId: parseInt(orderId),
  //     orderOperationId: parseInt(operationId),
  //     startedAt: formatISOBeforeSend(time),
  //     finishedAt: (finishDateTime ? formatISOBeforeSend(finishDateTime) : null) as string,
  //   };
  //   operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage)
  //   .catch(() =>{
  //     setToastMessage(t("orders.timeOverlap"));
  //     setTimespan(timespan =>({...timespan, startedAt: savedTime}))
  //   });
  //   setNeedSave(true);
  // };

  // const handleFinishTime = (time: string | string[]) => {
  //   if (Array.isArray(time)) return;
  //   const currentDateTime = getCurrentDateTimeISO();

  //   if (time < startDateTime) {
  //     setToastMessage(t("messages.finishDate"));
  //     return;
  //   }

  //   if (time > currentDateTime){
  //     setToastMessage(t("messages.timespanLimit"));
  //     return;
  //   }
  //   const savedTime = finishDateTime;
  //   setTimespan(timespan => ({
  //     ...timespan,
  //     finishedAt: time,
  //   }));
  //   const payload = {
  //     orderId: parseInt(orderId),
  //     orderOperationId: parseInt(operationId),
  //     startedAt: formatISOBeforeSend(startDateTime),
  //     finishedAt: formatISOBeforeSend(time),
  //   };
  //   operationId && TIMESPAN_REQUEST.updateTimespan(timespan.timespanId, payload, setLoading, setToastMessage)
  //   .catch(() =>{
  //     setToastMessage(t("orders.timeOverlap"));
  //     setTimespan(timespan =>({...timespan, finishedAt: savedTime as string}))
  //   });
  //   setNeedSave(true);
  // };
  const showToastMessage = (message: string) => {
    setToastMessage(message);
  };

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
          return;
        }
        finishedAt = formatISOBeforeSend(finishISO);
      }
      const nowISO = getCurrentDateTimeISO();
      if (startedAt > nowISO) {
        showToastMessage("Start date/time cannot be in the future");
        return;
      }
      if (finishedAt && finishedAt > nowISO) {
        showToastMessage("Finish date/time cannot be in the future");
        return;
      }
  
      if (activeTimespan.timespanId) {
        TIMESPAN_REQUEST.updateTimespan(
          parseInt(String(activeTimespan.timespanId), RADIX),
          { startedAt, finishedAt },
          setLoading,
          setToastMessage,
        )
        .then(() => {
          setSave(true);
        })
        .catch(() => {
          setToastMessage("Time overlaps with another timespan");
        });
      }
    };

  const startNewOperation = () => {
    history.push(ROUTES.SCANNER_QR);
  };

  const { hours, minutes } = formatTime(durationTime, true);

  return (
    <IonPage>
      <Header title={(orderOperation ?? activeTimespan?.orderOperation?.name ?? "").toLocaleLowerCase()} backButtonHref={ROUTES.MENU} />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <InputReadonly
              label={t("orders.orderName")}
              value={activeTimespan?.orderOperation?.orderItem?.order?.name || orderName || "-"}
            />
            <InputReadonly
              label={t("orders.orderYear")}
              value={String(activeTimespan?.orderOperation?.orderItem?.order?.orderYear || orderYear || "-")}
            />
            <InputReadonly
              label={t("orders.orderItem")}
              value={activeTimespan?.orderOperation?.orderItem?.name || orderItem || "-"}
            />
            <IonList className={`${style.page} ion-padding`}>
              {/* <IonList className={style.list}>
                <IonLabel className={style.label}>{t("form.operationDate")}</IonLabel>
                <InputDate value={formatDate(startDateTime)} />
              </IonList> */}
              <IonList className={style.sized}>
                <div className={style.container}>
                  
                  {/* {isStart && <TimeSelector time={startDateTime} modalRef={startModalRef} setTime={handleStartTime} />} */}
                  {startDate && startTime && isStart && (
                        <>
                          <IonLabel className={style.label}>{t("orders.startOperation")}</IonLabel>
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

                {!isStart && (
                  <IonButton expand="block" onClick={handleStartNow} disabled={isStart}>
                    {t("operations.start")}
                  </IonButton>
                )}
              </IonList>

              <IonList className={style.sized}>
                <div className={style.container}>
                  
                  {/* {finishDateTime && (
                    <TimeSelector time={finishDateTime} modalRef={finishModalRef} setTime={handleFinishTime} />
                  )} */}
                   {finishDate && finishTime && finishDateTime && (
                       <>
                        <IonLabel className={style.label}>{t("orders.finishOperation")}</IonLabel>
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

              {finishDateTime &&
                (!isSave ? (
                  <IonButton expand="block" onClick={() => {
                    setSave(false);
                    handleSave();
                  }}>
                    {t("operations.save")}
                  </IonButton>
                ) : (
                  <IonButton expand="block" onClick={startNewOperation}>
                    {t("text.startNewOperation")}
                  </IonButton>
                ))}
              <IonToast
                position="top"
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY_LONG}
                onDidDismiss={() => setToastMessage(null)}
                buttons={[
                  {
                    text: t("operations.dismiss"),
                    role: "cancel",
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
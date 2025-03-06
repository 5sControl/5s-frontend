import React, { useState, useEffect } from "react";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import {
  getTimeDifference,
  extractTime,
  formatYMD,
  formatDate,
  formatTime,
} from "../../../utils/parseInputDate";
import { TIMESPAN_REQUEST } from "../../../dispatcher";
import style from "./styles.module.scss";
import { ITimespan } from "../../../models/interfaces/orders.interface";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/header/Header";
import { Preloader } from "../../../components/preloader/preloader";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { Camera, EditWhiteIcon } from "../../../assets/svg/SVGcomponent";
import Fab from "../../../components/fab/Fab";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ROLE } from "../../../models/enums/roles.enum";
const RADIX = 10;

interface LocationState {
    orderName: string;
}

const GetTask: React.FC = () => {
  const { t } = useTranslation();
  const { orderId, itemId, operationId, timespanId } = useParams<{
    orderId: string;
    itemId: string;
    operationId: string;
    timespanId: string;
  }>();
  const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan);
  const location = useLocation<LocationState>();
const {orderName} = location.state || ""; 
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [finishDateTime, setFinishDateTime] = useState<string>("");
  const [isSave, setSave] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const history = useHistory();
  const userRole = useSelector((state: RootState) => state.user.role);
  

  const seconds = getTimeDifference(finishDateTime, startDateTime);
  const { hours, minutes } = formatTime(seconds);
  
  useIonViewWillEnter(() => {
    setLoading(true);
    timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, RADIX), setTimespan, setLoading, setToastMessage).catch(error => console.error(error)).finally(() => setLoading(false));
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
    history.go(-1);
    setIsSaveModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
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
    {isLoading ? (
        <div className="preloader">
        <Preloader />
        </div>
        ) : (
    <>
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
            {startDateTime && (
              <>
                <InputReadonly label={t("orders.orderNumber")} value={String(timespan.orderOperation.orderItem.order.orderNumber)} />
                <InputReadonly label={t("orders.orderYear")} value={String(timespan.orderOperation.orderItem.order.orderYear)} />
                <InputReadonly label={t("orders.orderItem")} value={String(timespan.orderOperation.orderItem.name)} />
                <InputReadonly label={t("form.operationDate")} value={formatDate(startDateTime)} />
                <InputReadonly label={t("orders.startOperation")} value={extractTime(startDateTime)} />
                <InputReadonly label={t("orders.finishOperation")} value={extractTime(finishDateTime)} />
                <InputReadonly label={t("orders.operationTime")} value={`${hours} ${t("time.hour")} ${
                      minutes ? minutes + " " + t("time.min") : ""
                    }`} />
                    
                    <Fab
                    icon={EditWhiteIcon}
                    handleFabClick={() => { history.push(ROUTES.EMPLOYEE_TASK_EDIT(
                        String(timespan.timespanId)
                      ),{ orderName: timespan.orderOperation.orderItem.name});
                      }}/>
                </>
)}
</IonContent>
</>)}
    </IonPage>
  );
};

export default GetTask;

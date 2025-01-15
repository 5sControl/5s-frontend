import React, { SetStateAction, useState } from "react";
import { IonContent, IonList, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import style from "./orderItem.module.scss";
import { useLocation, useParams } from "react-router-dom";
import { ORDER_REQUEST, TIMESPAN_REQUEST } from "../../../dispatcher";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { Preloader } from "../../../components/preloader/preloader";
import { TableRow } from "../../../models/interfaces/table.interface";
import { Table } from "../../../components/table/Table";
import { formatDate, formatTime } from "../../../utils/parseInputDate";
import { useDispatch } from "react-redux";
import { setTimespan } from "../../../store/timespanSlice";
import { IOrderOperation } from "../../../models/interfaces/operationItem.interface";

const RADIX = 10;

const OrderItem = () => {
  const { t } = useTranslation();
  const { orderId, itemId } = useParams() as {
    orderId: string;
    itemId: string;
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const operationId = Number(searchParams.get('operationId'));
  const [operation, setOperation] = useState<IOrderOperation | null>(null);
  const [timespans, setTimespans] = useState<any[]>([]);
  const [orderItemName, setOrderItemName] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  useIonViewWillEnter(() => {
    TIMESPAN_REQUEST.getOrderItemTimespans(
      parseInt(itemId, RADIX),
      setTimespans,
      setOrderItemName,
      setLoading,
      setToastMessage
    );
    if (operationId) {
      ORDER_REQUEST.getOrderOperationById(operationId, setOperation as React.Dispatch<SetStateAction<IOrderOperation>>, setLoading, setToastMessage);
    }
  });

  const saveTimespanInfo = (timespanWorker, finishTime) => {
    const timespanData = {
      timespanWorker: timespanWorker,
      timespanStatus: finishTime ? t("orders.statusValues.done") : t("orders.statusValues.inProgress"),
    };
    dispatch(setTimespan(timespanData));
  };

  const tableItems: TableRow[] =
    timespans?.filter(timespan => !operationId || timespan.orderOperation.id == operationId).map((timespan, index) => {
      const { hours, minutes } = formatTime(timespan.duration);
      const durationFormat = hours
        ? `${hours} ${t("time.hour")} ${minutes} ${t("time.min")}`
        : `${minutes} ${t("time.min")}`;
      return {
        id: timespan.timespanId,
        navigateTo: ROUTES.ORDER_TIMESPAN_EDIT(
          String(orderId),
          String(itemId),
          String(timespan.orderOperation.id),
          String(timespan.timespanId)
        ),
        handleClick: saveTimespanInfo(timespan?.employeeName, timespan?.finishedAt),
        values: [index + 1, timespan.employeeName, durationFormat, formatDate(timespan.startedAt)],
      };
    }) || [];

  return (
    <IonPage>
      <>
        <Header title={operationId ? operation?.name : orderItemName} backButtonHref={ROUTES.ORDER(String(orderId))} />
        <IonContent>
          {isLoading ? (
            <div className="preloader">
              <Preloader />
            </div>
          ) : (
            <>
              {!isLoading && (
                <>
                  <IonList className={style.page}>
                    <Table
                      label=""
                      cols={[
                        { label: t("orders.id"), size: 1 },
                        { label: t("orders.surname"), size: 4 },
                        { label: t("orders.time"), size: 3 },
                        { label: t("orders.date"), size: 4 },
                      ]}
                      rows={tableItems}
                    />
                    <IonToast
                      isOpen={!!toastMessage}
                      message={toastMessage || undefined}
                      duration={TOAST_DELAY}
                      onDidDismiss={() => setToastMessage(null)}
                    />
                  </IonList>
                </>
              )}
            </>
          )}
        </IonContent>
      </>
    </IonPage>
  );
};

export default OrderItem;

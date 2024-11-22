import React, { useState } from "react";
import { IonContent, IonList, IonPage, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import style from "./orderItem.module.scss";
import { useHistory, useParams } from "react-router-dom";
import { IItem, Item } from "../../../models/interfaces/item.interface";
import { ITEM_REQUEST, TIMESPAN_REQUEST } from "../../../dispatcher";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { Preloader } from "../../../components/preloader/preloader";
import { TableRow } from "../../../models/interfaces/table.interface";
import { Table } from "../../../components/table/Table";
import { IOrderItemTimespan, ITimespan } from "../../../models/interfaces/orders.interface";
import { formatDate, formatTime } from "../../../utils/parseInputDate";
import { useDispatch } from "react-redux";
import { setTimespan } from "../../../store/timespanSlice";

const RADIX = 10;

const OrderItem = () => {
  const { t } = useTranslation();
  const { orderId, itemId } = useParams() as {
    orderId: string;
    itemId: string;
  };
  const [timespans, setTimespans] = useState<any[]>([]);
  const [orderItemName, setOrderItemName] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const onDeleteHandle = () => {
    console.log("Delete");
  };

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    TIMESPAN_REQUEST.getOrderItemTimespans(parseInt(itemId, RADIX), setTimespans, setOrderItemName, setLoading, setToastMessage);
  });

  const saveTimespanInfo = (orderName, orderYear, orderItem) => {
    const timespanData = {
      orderName: orderName,
      orderYear: orderYear,
      orderItem: orderItem
    }
    dispatch(setTimespan(timespanData));
  };

  const tableItems: TableRow[] =
    timespans?.map((timespan, index) => {
      const { hours, minutes } = formatTime(timespan.duration);
      const durationFormat = hours ? `${hours} ${t("time.hour")} ${minutes} ${t("time.min")}` : `${minutes} ${t("time.min")}`;
      return {
        id: timespan.timespanId,
        navigateTo: ROUTES.ORDER_TIMESPAN_EDIT(String(orderId), String(itemId), String(timespan.orderOperation.id), String(timespan.timespanId)),
        handleClick: saveTimespanInfo(timespan?.orderOperation?.order_item?.order?.name, '-', timespan?.orderOperation?.order_item?.name),
        values: [index + 1, timespan.employeeName, durationFormat, formatDate(timespan.startedAt)],
      };
    }) || [];

  return (
    <IonPage>
      <>
        <Header title={orderItemName} backButtonHref={ROUTES.ORDER(String(orderId))} />
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

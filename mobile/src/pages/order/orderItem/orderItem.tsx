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
import { ITimespan } from "../../../models/interfaces/orders.interface";

const RADIX = 10;

const OrderItem = () => {
  const { t } = useTranslation();
  const { orderId, itemId } = useParams() as {
    orderId: string;
    itemId: string;
  };
  const [item, setItem] = useState<IItem>({} as IItem);
  const [timespans, setTimespans] = useState<ITimespan[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isLoaded = Boolean(Object.values(item)?.length);
  const history = useHistory();

  const onDeleteHandle = () => {
    console.log("Delete");
  };

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    ITEM_REQUEST.getItemById(parseInt(itemId, RADIX), setItem, setLoading, setToastMessage).then(() => {
      TIMESPAN_REQUEST.getOrderItemTimespans(parseInt(itemId, RADIX), setTimespans, setLoading, setToastMessage);
    });
  });

  const tableItems: TableRow[] =
    timespans.map((timespan, index) => {
      return {
        id: timespan.timespanId,
        navigateTo: '',
        values: [index + 1, timespan.employeeId, '', timespan.startedAt],
      };
    }) || [];

  return (
    <IonPage>
      <>
        <Header title={item.name} backButtonHref={ROUTES.ORDER(String(orderId))} />
        <IonContent>
          {isLoading ? (
            <div className="preloader">
              <Preloader />
            </div>
          ) : (
            <>
              {isLoaded && (
                <>
                  <IonList className={style.page}>
                    <InputReadonly label={t("orders.orderItem")} value={item.name} />
                    <Table
                      label={t("orders.operations")}
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

import React, { useEffect, useState } from "react";
import { IonContent, IonLabel, IonList, IonPage, IonLoading, IonToast, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import style from "./orderItem.module.scss";
import { useHistory, useParams } from "react-router-dom";
import { IItem, Item } from "../../../models/interfaces/item.interface";
import { ITEM_REQUEST, OPERATION_REQUEST, ORDER_ITEM_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import InputReadonly from "../../../components/inputs/inputReadonly/inputReadonly";
import { Preloader } from "../../../components/preloader/preloader";
import { IOrderOperation, IProductOperation } from "../../../models/interfaces/operationItem.interface";
import { TableRow } from "../../../models/interfaces/table.interface";
import Chip from "../../../components/chip/chip";
import { Table } from "../../../components/table/Table";

const RADIX = 10;

const OrderItem = () => {
  const { t } = useTranslation();
  const { orderId, itemId } = useParams() as {
    orderId: string;
    itemId: string;
  };
  const [item, setItem] = useState<IItem>({} as IItem);
  const [itemOperations, setItemOperations] = useState<IOrderOperation[]>([]);
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
    ITEM_REQUEST.getItemById(
      parseInt(orderId, RADIX),
      setItem,
      setLoading,
      setToastMessage
    ).then(() => {
      ORDER_REQUEST.getOrderItemOperations(parseInt(itemId, RADIX), setItemOperations, setLoading, setToastMessage);
    })
  });

  const tableItems: TableRow[] =
    itemOperations.map((op, index) => {
      return {
        id: op.id,
        navigateTo: ROUTES.ORDER_OPERATION(String(orderId), String(itemId), String(op.id)),
        values: [item.name, <Chip name={op.status}></Chip>],
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
                  <InputReadonly label={t('orders.orderItem')} value={item.name} />
                  <Table
                    label={t("orders.operations")}
                    cols={[
                      { label: t("orders.name"), size: 8 },
                      { label: t("orders.status"), size: 4 },
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

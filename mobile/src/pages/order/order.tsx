import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToast,
  SegmentChangeEventDetail,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../components/header/Header";
import style from "./order.module.scss";
import PencilIcon from "./../../assets/svg/editOutlined.svg";
import { useHistory, useParams } from "react-router";
import { ORDER_ITEM_REQUEST, ORDER_REQUEST } from "../../dispatcher";
import { formatDate } from "../../utils/parseInputDate";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../constants/toastDelay";
import Fab from "../../components/fab/Fab";
import InputReadonly from "../../components/inputs/inputReadonly/inputReadonly";
import { Table } from "../../components/table/Table";
import { TableRow } from "../../models/interfaces/table.interface";
import { Preloader } from "../../components/preloader/preloader";
import { IOrders } from "../../models/interfaces/orders.interface";
import { Item } from "../../models/interfaces/item.interface";
import { ORDER_STEPS } from "../../models/enums/orderSteps.enum";
import { OperationStatus } from "../../models/types/ordersStatus";
import { OPERATION_STATUS_ENUM } from "../../models/enums/statuses.enum";

const RADIX = 10;

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  const [order, setOrder] = useState<IOrders>({} as IOrders);
  const [orderItems, setOrderItems] = useState<Item[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>(ORDER_STEPS.ASSEMLY);
  const [isLoading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<boolean>(false);

  const isLoaded = Boolean(Object.values(order)?.length);

  useIonViewWillEnter(() => {
    id &&
      ORDER_REQUEST.getOrderById(parseInt(id, RADIX), setOrder, setLoading, setToastMessage).then(() => {
        ORDER_ITEM_REQUEST.getOrderItems(parseInt(id, RADIX), setOrderItems, setLoading, setToastMessage);
      });
  });

  const assemblyItems: TableRow[] =
    orderItems.map((item, index) => {
      return {
        id: item.id,
        navigateTo: ROUTES.ORDER_ITEM(String(order.id), String(item.id)),
        values: [index + 1, item.name, item.additionalInfo],
      };
    }) || [];

  const blankItems: TableRow[] = [];

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleSegmentChange = (event: CustomEvent<SegmentChangeEventDetail>) => {
    setSelectedSegment(event.detail.value as string);
  };

  const handleCompleteClick = () => {
    ORDER_REQUEST.completeOrder({orderId: order.id}, setLoading, setToastMessage)
    .then(() => {
      setCompletedOrder(true);
    });
  }

  return (
    <IonPage color="light">
      <Header title={order?.name} backButtonHref={ROUTES.ORDERS} />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            {isLoaded && (
              <>
                <InputReadonly label={t("form.name")} value={order?.name} />
                <InputReadonly label={t("orders.estimatedAt")} value={order?.estimatedAt ? formatDate(order?.estimatedAt) : "-"} />
                <InputReadonly label={t("orders.startedAt")} value={formatDate(order?.createdAt)} />
                
                <InputReadonly label="Завершить заказ" />
                <IonButton 
                  className="ion-padding" 
                  style={{paddingTop: "0"}}
                  expand="full" 
                  size="small"
                  onClick={handleCompleteClick}
                  disabled={order.status !== OPERATION_STATUS_ENUM.IN_PROGRESS || completedOrder}>
                    Завершить
                </IonButton>

                <div className="segment-wrapper ion-padding">
                  <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
                    <IonSegmentButton value={ORDER_STEPS.BLANK}>
                      <IonLabel>{t("orders.blank")}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value={ORDER_STEPS.ASSEMLY}>
                      <IonLabel>{t("orders.assembly")}</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </div>
                <Table
                  label={selectedSegment === ORDER_STEPS.BLANK ? t("orders.operations") : t("orders.orderItems")}
                  cols={[
                    { label: t("orders.id"), size: 1 },
                    { label: t("orders.name"), size: 7 },
                    { label: t("form.duration"), size: 4 },
                  ]}
                  rows={selectedSegment === ORDER_STEPS.BLANK ? blankItems : assemblyItems}
                />
                <Fab icon={PencilIcon} handleFabClick={() => handleFabClick(ROUTES.ORDER_EDIT(String(order.id)))} />
              </>
            )}
          </>
        )}
      </IonContent>

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
    </IonPage>
  );
};

export default Order;

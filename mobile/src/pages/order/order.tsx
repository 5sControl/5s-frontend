import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import Chip from "./../../components/chip/chip";
import { Header } from "../../components/header/Header";
import style from "./order.module.scss";
import ItemList from "../../components/itemList/itemList";
import { IOperation, IOrderWithAllOperations } from "../../models/interfaces/operationItem.interface";
import PencilIcon from "./../../assets/svg/editOutlined.svg";
import { useHistory, useParams } from "react-router";
import { ORDER_REQUEST } from "../../dispatcher";
import { formatDate } from "../../utils/parseInputDate";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../constants/toastDelay";
import Fab from "../../components/fab/Fab";
const RADIX = 10;

export interface IOrders {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  operations: IOperation[];
}

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  const [order, setOrder] = useState<IOrderWithAllOperations>({} as IOrderWithAllOperations);

  const [isLoading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoaded = Boolean(Object.values(order)?.length);

  useIonViewDidEnter(() => {
    id && ORDER_REQUEST.getOrder(parseInt(id, RADIX), setOrder, setLoading, setToastMessage);
  });

  const items = order?.operations?.map(item => (
    <ItemList key={item.id} label={item.name} to={ROUTES.ORDER_OPERATION(String(order.id), String(item.id))}>
      <IonLabel>{item.name}</IonLabel>
      <Chip name={item.status}></Chip>
    </ItemList>
  ));

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage color="light">
      <Header title={order?.name} backButtonHref={ROUTES.ORDERS} />
      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} />
        {isLoaded && (
          <>
            <IonList className={style.list}>
              <IonLabel>{t("form.name")}</IonLabel>
              <IonText color="medium">
                <p>{order?.name}</p>
              </IonText>
            </IonList>
            <IonList className={style.list}>
              <IonLabel>{t("form.date")}</IonLabel>
              <IonText color="medium">
                <p>{formatDate(order?.createdAt)}</p>
              </IonText>
            </IonList>
            <IonList className={style.list}>
              {items?.length ? (
                <>
                  <IonLabel>{t("orders.operations")}</IonLabel>
                  <IonList>{items}</IonList>
                </>
              ) : (
                <IonLabel>{t("text.noOperations")}</IonLabel>
              )}
            </IonList>
            <Fab icon={PencilIcon} handleFabClick={() => handleFabClick(ROUTES.ORDER_ITEM_EDIT(String(order.id)))} />
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

import React, { useMemo, useState } from "react";
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonToast,
  SegmentChangeEventDetail,
  useIonViewWillEnter,
} from "@ionic/react";
import { ROUTES } from "../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import { Chart, Plus } from "../../assets/svg/SVGcomponent";
import { IOrders } from "../../models/interfaces/orders.interface";
import { ORDER_REQUEST } from "../../dispatcher";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../constants/toastDelay";
import Fab from "../../components/fab/Fab";
import { useHistory } from "react-router";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { Preloader } from "../../components/preloader/preloader";
import { OperationStatus } from "../../models/types/ordersStatus";
import { OPERATION_STATUS_ENUM } from "../../models/enums/statuses.enum";

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OperationStatus>(OPERATION_STATUS_ENUM.IN_PROGRESS);

  const handleSetSearch = (v: string) => setSearchText(v);

  const concatOrderNumberName = (order: IOrders) => {
    return `${order.orderNumber} ${order.name || ""}`
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(item => {
      const statusFilter = item.status === selectedStatus;
      const searchFilter = concatOrderNumberName(item)?.toLowerCase().includes(searchText.toLowerCase());
      return statusFilter && searchFilter;
    });
  }, [orders, selectedStatus, searchText]);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  const handleStatusChange = (event: CustomEvent<SegmentChangeEventDetail>) => {
    setSelectedStatus(event.detail.value as OperationStatus);
  };

  useIonViewWillEnter(() => {
    ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage);
  });

  return (
    <IonPage>
      <Header
        title={t("orders.orders")}
        backButtonHref={ROUTES.MENU}
        searchBar={Boolean(orders?.length)}
        searchText={searchText}
        onSearchChange={handleSetSearch}
        endButton={<img src={Chart} alt="orders view" onClick={() => handleItemClick(ROUTES.ORDERSVIEW)}/>}
      />
      <IonContent color="light">
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
        <div className="segment-wrapper ion-padding">
          <IonSegment value={selectedStatus} onIonChange={handleStatusChange}>
            <IonSegmentButton value={OPERATION_STATUS_ENUM.PENDING}>
              <IonLabel>{t("orders.statusValues.pending")}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={OPERATION_STATUS_ENUM.IN_PROGRESS}>
              <IonLabel>{t("orders.statusValues.inProgress")}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={OPERATION_STATUS_ENUM.COMPLETED}>
              <IonLabel>{t("orders.statusValues.done")}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        <IonList inset>{filteredOrders.map(item => (
          <MenuListButton
            key={item.id}
            title={concatOrderNumberName(item)}
            handleItemClick={() => handleItemClick(ROUTES.ORDER(String(item.id)))}
          />
          ))}
        </IonList>
            <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.ORDER_ADD)} />
            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

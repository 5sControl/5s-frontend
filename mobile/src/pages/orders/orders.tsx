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
import { useHistory, useLocation } from "react-router";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { Preloader } from "../../components/preloader/preloader";
import { OperationStatus } from "../../models/types/ordersStatus";
import { OPERATION_STATUS_ENUM } from "../../models/enums/statuses.enum";
import styles from "./orders.module.scss";
import { daysDifference, formatDateUTC } from "../../utils/parseInputDate";

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const currentStatus = searchParams.get('status') || OPERATION_STATUS_ENUM.IN_PROGRESS;
  const [selectedStatus, setSelectedStatus] = useState<OperationStatus>(currentStatus as OperationStatus);

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
    const selectedStatus = event.detail.value as OperationStatus;
    searchParams.set('status', selectedStatus);
    history.replace({ search: searchParams.toString() });
    setSelectedStatus(selectedStatus);
  };

  useIonViewWillEnter(() => {
    ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage);
  });

  useIonViewWillEnter(() => {
    if (!searchParams.has('status')) {
      searchParams.set('status', selectedStatus);
      history.replace({ search: searchParams.toString() });
    }
  }, [history, searchParams]);

  const checkDeadline = (item: IOrders): string => {
    const estimatedAt = new Date(item.estimatedAt);
    estimatedAt.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (item.completedAt || !item.startedAt || !item.estimatedAt || currentDate <= estimatedAt) {
      return "";
    }
    const daysDiff = daysDifference(currentDate, estimatedAt);
    if (daysDiff <= 14) {
      return t("orders.deadlineExpired");
    }
    if (daysDiff <= 30) {
      return t("orders.deadlineExpiredWeeks")
    }
    if (daysDiff <= 60) {
      return t("orders.deadlineExpiredMonth");
    }
    return t("orders.deadlineExpiredMonths");
  } 
  return (
    <IonPage>
      <Header
        title={t("orders.orders")}
        backButtonHref={ROUTES.MENU}
        searchBar={Boolean(orders?.length)}
        searchText={searchText}
        searchPlaceholder={t("operations.orders.search")}
        onSearchChange={handleSetSearch}
        endButton={<img src={Chart} alt="orders view" onClick={() => handleItemClick(ROUTES.ORDERSVIEW)} />}
      />
      <IonContent color="light">
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <div className={"segment-wrapper ion-padding " + styles.statuses}>
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
            <IonList inset className={styles.ordersList}>
              {filteredOrders.map(item => (
                <MenuListButton
                  lines="none"
                  key={item.id}
                  title={concatOrderNumberName(item)}
                  handleItemClick={() => handleItemClick(ROUTES.ORDER(String(item.id)))}
                >
                  <div className={styles.orderCardItems}>
                    {checkDeadline(item) && <div className={styles.deadlineExpired}>{checkDeadline(item)}</div>}
                    {item.startedAt && (
                      <div>
                        <span className={styles.strong}>{t("orders.startedAt")}: </span>
                        {formatDateUTC(item.startedAt)}
                      </div>
                    )}
                    <div>
                      <span className={styles.strong}>{t("orders.estimatedAt")}: </span>
                      {item.estimatedAt ? formatDateUTC(item.estimatedAt) : "-"}
                    </div>
                    {item.completedAt && (
                      <div>
                        <span className={styles.strong}>{t("orders.completedAt")}: </span>
                        {formatDateUTC(item.completedAt)}
                      </div>
                    )}
                  </div>
                </MenuListButton>
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

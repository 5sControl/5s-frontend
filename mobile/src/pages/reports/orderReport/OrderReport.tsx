import { IonContent, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Preloader } from "../../../components/preloader/preloader";
import { IOrders } from "../../../models/interfaces/orders.interface";
import { ORDER_REQUEST } from "../../../dispatcher";
import MenuListButton from "../../../components/menuListButton/MenuListButton";

const OrderReport = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const concatOrderNumberName = (order: IOrders) => {
    return `${order.orderNumber} ${order.name || ""}`;
  };

  const handleSetSearch = (v: string) => setSearchText(v);

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  const filteredOrders = useMemo(
    () => orders.filter(item => concatOrderNumberName(item)?.toLowerCase().includes(searchText.toLowerCase())),
    [orders, searchText]
  );

  useIonViewWillEnter(() => {
    ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage);
  });

  return (
    <IonPage>
      <Header
        title={t("reports.orderDetails")}
        backButtonHref={ROUTES.REPORTS}
        searchBar={Boolean(orders?.length)}
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <IonList inset={true}>
            {filteredOrders.map(order => (
              <MenuListButton
                key={order.id}
                title={concatOrderNumberName(order)}
                handleItemClick={() => handleItemClick(ROUTES.REPORT_ORDER(order.id))}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
export default OrderReport;

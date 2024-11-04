import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import { ROUTES } from "../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import ItemList from "../../components/itemList/itemList";
import { Plus } from "../../assets/svg/SVGcomponent";
import { IOrders } from "../../models/interfaces/orders.interface";
import { ORDER_REQUEST } from "../../dispatcher";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "./../../constants/toastDelay";
import Fab from "../../components/fab/Fab";
import { useHistory } from "react-router";
import MenuListButton from "../../components/menuListButton/MenuListButton";

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<IOrders[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSetSearch = (v: string) => setSearchText(v);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    const filtered = orders.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    orders.length && setFilteredItems(orders);
  }, [orders]);

  useIonViewDidEnter(() => {
    ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage);
  });

  const items = filteredItems.map(item => (
    <MenuListButton
      key={item.id}
      title={item.name}
      handleItemClick={() => handleItemClick(ROUTES.ORDER_ITEM(String(item.id)))}
    />
  ));

  return (
    <IonPage>
      <IonLoading isOpen={isLoading} />
      <Header
        title={t("orders.orders")}
        backButtonHref={ROUTES.MENU}
        searchBar={Boolean(orders?.length)}
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent color="light">
        <IonList inset>{items}</IonList>
        <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.ORDER)} />
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || undefined}
          duration={TOAST_DELAY}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

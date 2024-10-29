import React, { useEffect, useState } from 'react';
import { IonContent, IonFab, IonFabButton, IonIcon, IonList, IonLoading, IonPage, IonToast } from '@ionic/react';
import { ROUTES } from '../../shared/constants/routes';
import { Header } from '../../components/header/Header';
import ItemList from '../../components/itemList/itemList';
import style from './orders.module.scss';
import { Plus } from '../../assets/svg/SVGcomponent';
import { IOrders } from '../../models/interfaces/orders.interface';
import { ORDER_REQUEST } from '../../dispatcher';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../constants/toastDelay';
import Fab from '../../components/fab/Fab';
import { useHistory } from 'react-router';

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory(); 
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filteredItems, setFilteredItems] = useState<IOrders[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSetSearch = (v: string) => setSearchText(v);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    const filtered = orders.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    orders.length && setFilteredItems(orders);
  }, [orders]);

  useEffect(() => {
    ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage);
  }, []);

  const items = filteredItems.map((item) => (
    <ItemList key={item.id} label={`${item.name}`} to={ROUTES.ORDER_ITEM(String(item.id))}></ItemList>
  ));

  return (
    <IonPage>
        <IonLoading isOpen={isLoading} />
        <Header
            title={t('orders.orders')}
            backButtonHref={ROUTES.MENU}
            searchBar={Boolean(orders?.length)}
            searchText={searchText}
            onSearchChange={handleSetSearch}
        />
        <IonContent color="light" className="ion-padding">
            <IonList>{items}</IonList>
            <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.ORDER)}/>
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
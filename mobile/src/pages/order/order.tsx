import React, { useEffect, useState } from 'react';
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
} from '@ionic/react';
import Chip from './../../components/chip/chip';
import { Header } from '../../components/header/Header';
import style from './order.module.scss';
import ItemList from '../../components/itemList/itemList';
import { IOperation, IOrderWithAllOperations } from '../../models/interfaces/operationItem.interface';
import PencilIcon from './../../assets/svg/editOutlined.svg';
import { useHistory, useParams } from 'react-router';
import { ORDER_REQUEST } from '../../dispatcher';
import { formatDate } from '../../utils/parseInputDate';
import { ROUTES } from '../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../constants/toastDelay';
import Fab from '../../components/fab/Fab';
import InputReadonly from '../../components/inputs/inputReadonly/inputReadonly';
import { Table } from '../../components/table/Table';
import { TableRow } from '../../models/interfaces/table.interface';
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

  useEffect(() => {
    id && ORDER_REQUEST.getOrder(parseInt(id, RADIX), setOrder, setLoading, setToastMessage);
  }, []);

  const items: TableRow[] = order?.operations?.map((item, index) => {
    return {
      id: item.id,
      navigateTo: ROUTES.ORDER_OPERATION(String(order.id), String(item.id)),
      values: [
        index + 1,
        item.name,
        <Chip name={item.status}></Chip>
      ]
    };
  }) || [];

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage color="light">
      <Header title={order?.name} backButtonHref={ROUTES.ORDERS} />
        <IonContent>
          <IonLoading isOpen={isLoading} />
          {isLoaded && (
            <>
            <InputReadonly label={t('form.name')} value={order?.name} />
            <InputReadonly label={t('form.date')} value={formatDate(order?.createdAt)} />
            <Table label={t('orders.operations')} 
              cols={[
                {label: t('orders.number'), size: 1},
                {label: t('orders.name'), size: 7},
                {label: t('orders.status'), size: 4}]} 
              rows={items} />
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
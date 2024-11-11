import React, { useState } from 'react';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonToast,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import { useHistory, useLocation } from 'react-router-dom';
import ModalSave from '../../../components/modalSave/modalSave';
import styles from './style.module.scss';
import { ITEM_REQUEST, ORDER_ITEM_REQUEST, ORDER_REQUEST } from '../../../dispatcher';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { Input } from '../../../components/inputs/input/Input';
import { set, values } from 'lodash';
import BottomButton from '../../../components/bottomButton/BottomButton';
import { Table } from '../../../components/table/Table';
import AddButton from '../../../components/addButton/AddButton';
import ItemList from '../../../components/itemList/itemList';
import Chip from '../../../components/chip/chip';
import { OPERATION_STATUS_ENUM } from '../../../models/enums/statuses.enum';
import { TableRow } from '../../../models/interfaces/table.interface';
import { useDispatch, useSelector } from 'react-redux';
import { setMaxOrderItemId, setOrderItems, setOrderName, setTempOrderItemId } from '../../../store/orderSlice';
import { RootState } from '../../../store';
import { IOrderItemAddBody } from '../../../models/interfaces/item.interface';
import { IOrders } from '../../../models/interfaces/orders.interface';

const AddOrder: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<IOrders>({} as IOrders);
  const orderItems = useSelector((state: RootState) => state.order.orderItems);
  const maxOrderItemId: any = useSelector((state: RootState) => state.order.maxOrderItemId);

  const navigateTo = () => {
    history.push(ROUTES.ORDERS);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    setLoading(true);
    ORDER_REQUEST.addOrder({name: inputValue, additionalInfo: '', estimatedTime: 0, estimatedTimeUnit: 'minutes'}, setLoading, setToastMessage, () => {})
    .then((res: any) => {
      console.log(res);
      Object.values(orderItems).forEach((item: any) => {
        const newItem: IOrderItemAddBody = {
          orderId: res.id,
          name: item.name,
          additionalInfo: item.suffix,
          quantity: 1,
          itemId: item.id
        }
        ORDER_ITEM_REQUEST.createOrderItem(newItem, setLoading, setToastMessage, () => {
          item.operations.forEach((operation: any) => {
            const newOperation = {
              orderItemId: item.id,
              operationIds: item.operations.map(operation => operation.id)
            }
            ORDER_REQUEST.addOrderItemOperation(newOperation, setLoading, setToastMessage)
          })
        });
      })
    })
    .finally(() => {
      navigateTo();
      setLoading(false);
      dispatch(setOrderName(''));
      dispatch(setOrderItems({}));
      dispatch(setMaxOrderItemId(1))
      dispatch(setTempOrderItemId(1));
    });
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    dispatch(setOrderName(inputValue));
    dispatch(setTempOrderItemId(maxOrderItemId));
    history.push(ROUTES.ORDER_ADD_ITEM);
  };

  const operationItems: TableRow[] = Object.values(orderItems)?.map((item: any, index: number) => {
    return {
      id: item.id,
      navigateTo: '',
      navigationAllowed: false,
      values: [
        item.id,
        item.name,
        item.suffix
      ]
    };
  }) || [];

  return (
    <IonPage color="light">
      <Header title={t('orders.newOrder')} backButtonHref={ROUTES.ORDERS} />
      <IonContent>
        <IonLoading isOpen={isLoading} />
        <Input 
          label={t('form.name')}
          value={inputValue}
          required={true} 
          handleChange={(e) => setInputValue(e.detail.value!)}
        />
        <Table label={t('orders.orderItems')} 
          cols={[
            {label: t('orders.id'), size: 1}, 
            {label: t('orders.name'), size: 7}, 
            {label: t('orders.suffix'), size: 4}]} 
          rows={operationItems} />
        <AddButton handleClick={handleAddClick} label={t('operations.add')}></AddButton>
        <BottomButton handleClick={openModal} disabled={!inputValue} label={t('operations.save')}/>
        <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
      <ModalSave
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
      ></ModalSave>
      </IonContent>
    </IonPage>
  );
};

export default AddOrder;
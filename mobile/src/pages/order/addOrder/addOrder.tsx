import React, { useRef, useState } from 'react';
import {
  IonContent,
  IonDatetime,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonToast,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import { useHistory } from 'react-router-dom';
import ModalSave from '../../../components/modalSave/modalSave';
import styles from './style.module.scss';
import { ORDER_ITEM_REQUEST, ORDER_REQUEST } from '../../../dispatcher';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { Input } from '../../../components/inputs/input/Input';
import BottomButton from '../../../components/bottomButton/BottomButton';
import { useDispatch, useSelector } from 'react-redux';
import InputDate from '../../../components/inputs/inputDate/inputDate';
import { formatDate, getCurrentDateTimeISO } from '../../../utils/parseInputDate';
import { set } from 'lodash';

const AddOrder: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderName, setOrderName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [estimatedAt, setEstimatedAt] = useState<string>('');
  const estimatedModalRef = useRef<HTMLIonModalElement>(null);

  const navigateTo = () => {
    history.push(ROUTES.ORDERS);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    setLoading(true);
    ORDER_REQUEST.addOrder({orderNumber: orderNumber, name: orderName, additionalInfo: '', estimatedTime: 0, estimatedTimeUnit: 'minutes'}, setLoading, setToastMessage, () => {})
    .then((res: any) => {
      setOrderName('');
      setOrderNumber('');
      setEstimatedAt('');
    })
    .finally(() => {
      navigateTo();
      setLoading(false);
    });
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage color="light">
      <Header title={t('orders.newOrder')} backButtonHref={ROUTES.ORDERS} />
      <IonContent>
        <IonLoading isOpen={isLoading} />
        <Input 
          label={t('orders.orderNumber')}
          value={orderNumber}
          required={true} 
          handleChange={(e) => setOrderNumber(e.detail.value!)}
          type='number'
        />
        <Input 
          label={t('orders.orderName')}
          value={orderName}
          required={true} 
          handleChange={(e) => setOrderName(e.detail.value!)}
        />
        <IonList className='ion-padding' style={{ gap: ".5rem" }}>
          <IonLabel className='text-bold'>{t("orders.estimatedAt")}</IonLabel>
          <InputDate value={estimatedAt ? formatDate(estimatedAt) : ""} onClick={() => estimatedModalRef.current?.present()}></InputDate>
        </IonList>
        <BottomButton handleClick={openModal} disabled={!orderNumber} label={t('operations.save')}/>
        <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
        <IonModal ref={estimatedModalRef}>
          <IonDatetime
            id="estimated-datetime"
            presentation="date-time"
            value={estimatedAt}
            onIonChange={e => setEstimatedAt(e.detail.value!.toString())}
          />
        </IonModal>
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
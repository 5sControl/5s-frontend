import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import { useHistory, useLocation } from 'react-router-dom';
import ModalSave from '../../../components/modalSave/modalSave';
import styles from './style.module.scss';
import { ORDER_REQUEST } from '../../../dispatcher';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { Input } from '../../../components/input/Input';
import { values } from 'lodash';

const AddOrder: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
    const name = (location.state as { message: string })?.message || '';
  const [inputValue, setInputValue] = useState<string>(name);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigateTo = () => {
    history.push(ROUTES.ORDERS);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    ORDER_REQUEST.addOrder(
      { name: inputValue, operationIds: [] },
      setLoading,
      setToastMessage,
      navigateTo
    );
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleClick = () => {
    history.push(ROUTES.ORDER_OPERATIONS, { state: { message: inputValue } });
  };

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
        <IonButton onClick={openModal} disabled={!inputValue} className="bottom-50" expand="full">
          {t('operations.save')}
        </IonButton>
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
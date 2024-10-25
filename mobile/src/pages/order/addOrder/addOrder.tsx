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
      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} />
        <IonList className={styles.page}>
          <IonList className={styles.list}>
            <IonLabel>{t('form.name')}</IonLabel>
            <IonInput
              fill="outline"
              value={inputValue}
              className="input__wrapper"
              maxlength={50}
              onIonInput={(e) => setInputValue(e.detail.value!)}
            ></IonInput>
          </IonList>
          <IonList className={styles.list}>
            <IonLabel>{t('orders.operations')}</IonLabel>
            <IonItem onClick={handleClick}>
              <IonLabel>{t('orders.newOperations')}</IonLabel>
            </IonItem>
          </IonList>
        </IonList>
      </IonContent>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
      <IonFooter style={{ paddingBottom: '50px' }} className="ion-padding">
        <IonButton expand="block" onClick={openModal} disabled={!inputValue}>
          {t('form.save')}
        </IonButton>
      </IonFooter>
      <ModalSave
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
      ></ModalSave>
    </IonPage>
  );
};

export default AddOrder;
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
import { ORDER_REQUEST } from '../../../dispatcher';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { Input } from '../../../components/inputs/input/Input';
import { values } from 'lodash';
import BottomButton from '../../../components/bottomButton/BottomButton';
import { Table } from '../../../components/table/Table';
import AddButton from '../../../components/addButton/AddButton';
import ItemList from '../../../components/itemList/itemList';
import Chip from '../../../components/chip/chip';
import { OPERATION_STATUS_ENUM } from '../../../models/enums/statuses.enum';

const AddOrder: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const state = (location.state as any)?.state;
  const selectedOperations = state?.selectedOperations || [];
  const name = state?.message || '';
  const [inputValue, setInputValue] = useState<string>(name);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigateTo = () => {
    history.push(ROUTES.ORDERS);
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    const selectedIds = selectedOperations.map((item: {id: number, name: string}) => item.id);
    ORDER_REQUEST.addOrder(
      { name: inputValue, operationIds: selectedIds },
      setLoading,
      setToastMessage,
      navigateTo
    );
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    history.push(ROUTES.ORDER_ADD_OPERATION, { state: { message: inputValue } });
  };

  const operationItems = selectedOperations?.map((operation: {id: number, name: string}, index: number) => {
    return (
      <ItemList 
        to=''
        key={operation.id}
        navigationAllowed={false}>
        <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              {index + 1}
            </IonCol>
            <IonCol class="ion-text-center">
              {operation.name}
            </IonCol>
            <IonCol class="ion-text-center">
              <Chip name={OPERATION_STATUS_ENUM.PENDING}></Chip>
            </IonCol>
          </IonRow>
        </IonGrid>
      </ItemList>
    );
  });

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
        <Table label={t('orders.operations')} cols={[t('orders.number'), t('orders.name'), t('orders.status')]} items={operationItems} />
        <AddButton handleClick={handleAddClick} label={t('operations.add')}></AddButton>
        {/* <BottomButton handleClick={openModal} disabled={!inputValue} label={t('operations.save')}/> */}
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
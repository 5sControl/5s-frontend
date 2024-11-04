import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
  useIonViewDidEnter,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import { useLocation, useHistory } from 'react-router-dom';
import { OPERATION_REQUEST, ORDER_REQUEST } from '../../../dispatcher';
import { IProductOperation } from '../../../models/interfaces/operationItem.interface';
import ModalSave from '../../../components/modalSave/modalSave';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { IReference } from '../../../models/interfaces/orders.interface';
import BottomButton from '../../../components/bottomButton/BottomButton';

const AddOrderOperation: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const state = (location.state as any)?.state;
  const name = state?.message || '';
  const [searchText, setSearchText] = useState<string>('');
  const [operations, setOperations] = useState<IProductOperation[]>([]);
  const [filteredItems, setFilteredItems] = useState<IProductOperation[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<{id: number, name: string}[]>(state?.selectedOperations || []);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);

  useEffect(() => {
    const filtered = operations.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    operations.length && setFilteredItems(operations);
  }, [operations]);

  useIonViewDidEnter(() => {
    OPERATION_REQUEST.getOperations(setOperations, setOperationReferences, setLoading, setToastMessage);
  });

  const handleCheckboxChange = (id: number, name: string, checked: boolean) => {
    if (checked) {
      setSelectedOperations((prev) => [...prev, {id: id, name: name}]);
    } else {
      setSelectedOperations((prev) => prev.filter((item) => item.id !== id));
    }
  };
  const navigateTo = () => {
    history.push(ROUTES.ORDER, { state: { selectedOperations: selectedOperations, message: name }, direction: 'back' });
  }

  const handleSubmit = async () => {
    setIsModalOpen(false);
    if (!name) {
      setToastMessage(t("messages.orderName"));
      return;
    }
    const selectedIds = selectedOperations.map((item) => item.id);
    ORDER_REQUEST.addOrder(
      { name, operationIds: selectedIds },
      setLoading,
      setToastMessage,
      navigateTo
    );
  };
  const handleSetSearch = (v: string) => setSearchText(v);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t('form.selectOperation')}
        onBackClick={navigateTo}
        backButtonHref="#"
        searchBar
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent>
        <IonList className="ion-padding">
          {filteredItems.map((item) => (
            <IonItem key={item.id}>
              <IonLabel>{item.name}</IonLabel>
              <IonCheckbox
                style={{ "--border-radius": "none" }}
                slot="end"
                onIonChange={(e) =>
                  handleCheckboxChange(item.id, item.name, e.detail.checked)
                }
                checked={selectedOperations.some((operation) => operation.id === item.id)}
              />
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || undefined}
          duration={TOAST_DELAY}
          onDidDismiss={() => setToastMessage(null)}
        />
        <ModalSave
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}/>
        <IonLoading isOpen={isLoading} />
        <BottomButton handleClick={openModal} label={t('operations.save')} disabled={selectedOperations.length === 0}/>
      </IonContent>
    </IonPage>
  );
};

export default AddOrderOperation;

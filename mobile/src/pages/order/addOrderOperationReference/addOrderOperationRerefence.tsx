import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonCheckbox,
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
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ModalSave from '../../../components/modalSave/modalSave';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/constants/routes';
import { IReference } from '../../../models/interfaces/orders.interface';
import { OPERATION_REQUEST } from '../../../dispatcher';
import { TOAST_DELAY } from '../../../constants/toastDelay';
import './addOrderOperationReference.scss'

const AddOrderOperationReference: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { refId } = useParams<{ refId: string }>();
  const location = useLocation();
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [references, setReferences] = useState<IReference[]>([]);
  const [filteredItems, setFilteredItems] = useState<IReference[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const filtered = references.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    console.log(references);
    references.length && setFilteredItems(references);
  }, [references]);

  useEffect(() => {
    OPERATION_REQUEST.getOperationReferenceItems(parseInt(refId), setReferences, setLoading, setToastMessage);
  }, []);

  const navigateTo = () => {
    history.goBack();
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    // ORDER_REQUEST.addOrder(
    //   { name: inputValue, operationIds: [] },
    //   setLoading,
    //   setToastMessage,
    //   navigateTo
    // );
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <IonPage color="light">
      <Header title="Добавить" 
        backButtonHref={ROUTES.ORDERS} 
        searchBar={true} 
        searchText={searchText}
        onSearchChange={setSearchText}/>
      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} />
        <IonList>
          {filteredItems.map((item) => (
            <IonItem key={item.id}>
              <IonCheckbox
                className='reference-item'
                justify="space-between"
                onIonChange={(e) =>
                  handleCheckboxChange(item.id, e.detail.checked)
                }
              >
                {item.name}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
      <IonFooter style={{ paddingBottom: '50px' }} className="ion-padding">
        <IonButton
          expand="block"
          onClick={openModal}
          disabled={selectedIds.length === 0}
        >
          {t('operations.save')}
        </IonButton>
      </IonFooter>

      <ModalSave
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
      ></ModalSave>

      <IonLoading isOpen={isLoading} />
    </IonPage>
  );
};

export default AddOrderOperationReference;
import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonToast,
  IonLoading,
  IonFooter,
  IonText,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import { ROUTES } from '../../../shared/constants/routes';
import { useParams, useHistory } from 'react-router-dom';
import ModalSave from '../../../components/modalSave/modalSave';
import {
  IOrderWithAllOperations,
  IProductOperation,
} from '../../../models/interfaces/operationItem.interface';
import styles from './editOrder.module.scss';
import { OPERATION_REQUEST, ORDER_REQUEST } from '../../../dispatcher';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { isEquals } from './../../../utils/helpers';
import { use } from 'i18next';
import { IReference } from '../../../models/interfaces/orders.interface';

const EditOrder: React.FC = () => {
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const [order, setOrder] = useState<IOrderWithAllOperations>(
    {} as IOrderWithAllOperations
  );
  const [operations, setOperations] = useState<IProductOperation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);
  const initIds = useRef([] as number[]);

  useEffect(() => {
    if (order?.operations) {
      const ids = order.operations.map((item) => item.referenceOperationId);
      setSelectedIds(ids);
      if (!initIds.current.length) {
        initIds.current = ids;
      }
    }
  }, [order]);

  useEffect(() => {
    if (!id) return;
    ORDER_REQUEST.getOrder(
      parseInt(id, 10),
      setOrder,
      setLoading,
      setToastMessage
    );
    OPERATION_REQUEST.getOperations(setOperations, setOperationReferences, setLoading, setToastMessage);
  }, []);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsModalOpen(false);
    ORDER_REQUEST.updateOrder(
      parseInt(id),
      { ...order, operationIds: selectedIds },
      setLoading,
      setToastMessage,
      handleNavigate
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleNavigate = () => {
    history.push(ROUTES.ORDERS);
  };

  const operationList = operations.map((operation) => (
    <IonItem key={operation.id}>
      <IonLabel>{operation.name}</IonLabel>
      <IonCheckbox
        style={{ '--border-radius': 'none' }}
        slot="end"
        onIonChange={(e) =>
          handleCheckboxChange(operation.id, e.detail.checked)
        }
        checked={selectedIds.includes(operation.id)}
      />
    </IonItem>
  ));

  return (
    <IonPage>
      <Header
        title={`${t('operations.edit')} ${order.name}`}
        backButtonHref={ROUTES.ORDERS}
      />
      <IonContent className="ion-padding">
        <IonList className={styles.page}>
          <IonList className={styles.list}>
            <IonLabel>{t('form.name')}</IonLabel>
            <IonText color="medium">{order.name}</IonText>
          </IonList>
          <IonList className={styles.list}>
            <IonLabel>{t('orders.operations')}</IonLabel>
            <IonList>{operationList}</IonList>
          </IonList>
        </IonList>
      </IonContent>
      <IonFooter style={{ paddingBottom: '50px' }} className="ion-padding">
        <IonButton
          expand="block"
          onClick={openModal}
          disabled={isEquals(selectedIds, initIds.current)}
        >
          {t('operations.save')}
        </IonButton>
      </IonFooter>

      <ModalSave
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
      ></ModalSave>
      <IonLoading isOpen={loading} />
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
    </IonPage>
  );
};

export default EditOrder;
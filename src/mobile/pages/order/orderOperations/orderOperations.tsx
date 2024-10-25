import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading,
  IonFab,
  IonFabButton,
  IonToast,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import trashOutline from '../../../assets/svg/deleteRedOutlined.svg';
import style from './orderOperations.module.scss';
import { useParams } from 'react-router-dom';
import { IOrderOperation } from '../../../models/interfaces/operationItem.interface';
import ItemList from '../../../components/itemList/itemList';
import { formatDate } from '../../../utils/parseInputDate';
import { ORDER_REQUEST } from '../../../dispatcher';
import { add } from 'ionicons/icons';
import { formatTime } from './../../../utils/parseInputDate';
import { ROUTES } from '../../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
const RADIX = 10;

const OrderOperations = () => {
  const { t } = useTranslation();
  const { id, operationId } = useParams() as {
    id: string;
    operationId: string;
  };
  const [operation, setOperation] = useState<IOrderOperation>({} as IOrderOperation);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isLoaded = Boolean(Object.values(operation)?.length);

  const onDeleteHandle = () => {
    console.log('Delete');
  };

  useEffect(() => {
    ORDER_REQUEST.getOrderOperationsById(
      parseInt(id, RADIX),
      parseInt(operationId, RADIX),
      setOperation,
      setLoading,
      setToastMessage
    );
  }, []);

  const deleteIcon = <IonIcon icon={trashOutline} className={style.deleteIcon} onClick={onDeleteHandle} />;

  const timespanItems = operation?.timespans?.map((timespan) => {
    const { hours, minutes } = formatTime(timespan.duration);
    const timestring = [hours && `${hours} ${t('time.hour')}`, minutes && `${minutes} ${t('time.min')}`]
      .filter(Boolean)
      .join(' ');

    return (
      <ItemList to={ROUTES.ORDER_TIMESPAN_EDIT(String(id), String(operationId), String(timespan.id))} key={timespan.id}>
        <IonGrid>
          <IonRow>
            <IonCol className={style.itemLabel}>
              <IonLabel>{formatDate(timespan.startedAt)}</IonLabel>
            </IonCol>
            <IonCol className={style.itemLabel}>
              <IonLabel>{timespan.employeeName}</IonLabel>
            </IonCol>
            <IonCol className={style.itemLabel}>
              <IonLabel>{timestring || 0}</IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </ItemList>
    );
  });

  return (
    <IonPage>
      <IonLoading isOpen={isLoading} />
      {isLoaded && (
        <>
          <Header title={operation.name} backButtonHref={ROUTES.ORDER_ITEM(String(id))} />
          <IonContent className={'ion-padding'}>
            <IonList className={style.page}>
              <IonList className={style.list}>
                <IonLabel>{t('orders.operation')}</IonLabel>
                <IonText>{operation.name}</IonText>
              </IonList>
              <IonList className={style.list}>
                <IonLabel>{t('orders.parts')}</IonLabel>
                <ItemList label={t('orders.nameparts')} to={`#`}></ItemList>
              </IonList>
              <IonList className={style.list}>
                <IonLabel>{t('orders.place')}</IonLabel>
                <ItemList label={t('orders.namepPlace')} to={`#`}></ItemList>
              </IonList>
              <IonList className={style.list}>
                <IonLabel>{t('orders.equipment')}</IonLabel>
                <ItemList label={t('orders.nameEquipment')} to={`#`}></ItemList>
              </IonList>
              <IonList className={style.list}>
                <IonLabel>{t('orders.implementation')}</IonLabel>
                {timespanItems?.length ? (
                  <>
                    <IonList>
                      <IonItem>
                        <IonGrid>
                          <IonRow>
                            <IonCol className={style.itemLabel}>
                              <IonLabel>{t('form.date')}</IonLabel>
                            </IonCol>
                            <IonCol className={style.itemLabel}>
                              <IonLabel>{t('form.name')}</IonLabel>
                            </IonCol>
                            <IonCol className={style.itemLabel}>
                              <IonLabel>{t('form.duration')}</IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonItem>
                      {timespanItems}
                    </IonList>
                  </>
                ) : (
                  <IonLabel slot="center">{t('text.norecords')}</IonLabel>
                )}
              </IonList>
            </IonList>
            <IonFab className={style.button} slot="fixed" horizontal="end" vertical="bottom">
              <IonFabButton
                routerLink={ROUTES.ORDER_TIMESPAN(String(id), String(operation.id))}
                style={{ '--border-radius': '15px' }}
              >
                <IonIcon icon={add}></IonIcon>
              </IonFabButton>
            </IonFab>
          </IonContent>
        </>
      )}
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || undefined}
        duration={TOAST_DELAY}
        onDidDismiss={() => setToastMessage(null)}
      />
    </IonPage>
  );
};

export default OrderOperations;

import React, { useEffect, useState } from "react";
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
  IonNote,
  useIonViewDidEnter,
} from '@ionic/react';
import { Header } from '../../../components/header/Header';
import trashOutline from '../../../assets/svg/deleteRedOutlined.svg';
import style from './orderOperations.module.scss';
import { useHistory, useParams } from 'react-router-dom';
import { IOrderOperation, IProductOperation } from '../../../models/interfaces/operationItem.interface';
import ItemList from '../../../components/itemList/itemList';
import { formatDate } from '../../../utils/parseInputDate';
import { OPERATION_REQUEST, ORDER_REQUEST } from '../../../dispatcher';
import { add } from 'ionicons/icons';
import { formatTime } from './../../../utils/parseInputDate';
import { ROUTES } from '../../../shared/constants/routes';
import { useTranslation } from 'react-i18next';
import { TOAST_DELAY } from './../../../constants/toastDelay';
import { IReference } from '../../../models/interfaces/orders.interface';
import { InputLookup } from '../../../components/inputs/inputLookup/inputLookup';
import { Table } from '../../../components/table/Table';
import { Plus } from '../../../assets/svg/SVGcomponent';
import Fab from '../../../components/fab/Fab';
import { ROLE } from '../../../models/enums/roles.enum';
import { TableRow } from '../../../models/interfaces/table.interface';
import { Input } from '../../../components/inputs/input/Input';
import InputReadonly from '../../../components/inputs/inputReadonly/inputReadonly';

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
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);
  const [newOperations, setNewOperations] = useState<IProductOperation[]>([]);
  const history = useHistory();

  const onDeleteHandle = () => {
    console.log("Delete");
  };

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const getUserRole = () => {
    return localStorage.getItem("userRole");
  };

  useIonViewDidEnter(() => {
    ORDER_REQUEST.getOrderOperationsById(
      parseInt(id, RADIX),
      parseInt(operationId, RADIX),
      setOperation,
      setLoading,
      setToastMessage
    );
    OPERATION_REQUEST.getOperations(setNewOperations, setOperationReferences, setLoading, setToastMessage);
  });

  const timespanItems: TableRow[] = operation?.timespans?.map((timespan) => {
    const { hours, minutes } = formatTime(timespan.duration);
    const timestring = [hours && `${hours} ${t("time.hour")}`, minutes && `${minutes} ${t("time.min")}`]
      .filter(Boolean)
      .join(" ");
    
    return {
      id: timespan.id,
      navigateTo: ROUTES.ORDER_TIMESPAN_EDIT(String(id), String(operationId), String(timespan.id)),
      navigationAllowed: getUserRole() === ROLE.WORKER,
      values: [
        formatDate(timespan.startedAt),
        timespan.employeeName,
        timestring || 0
      ]
    };
  }) || [];

  return (
    <IonPage>
        <>
          <Header title={operation.name} backButtonHref={ROUTES.ORDER_ITEM(String(id))} />
          <IonContent>
           <IonLoading isOpen={isLoading} />
           {isLoaded && (
            <>
            <IonList className={style.page}>
              <InputReadonly label={t('orders.operation')} value={operation.name} />
              <IonList className='ion-padding'>
                {
                    operationReferences.map((param: IReference) => 
                      !param.isProtected &&
                        <InputLookup
                          key={param.id}
                          label={param.name}
                          value={param.name}
                          note={operation.extensions.find(ext => ext.id === param.id)?.name || t('operations.add')}
                          handleNavigateClick={() => history.push(ROUTES.ORDER_OPERATION_ADD_REFERENCE(String(id), String(operationId), String(param.id)))}/>
                    )
                }
              </IonList>
              <IonList className={style.list}>
                {timespanItems?.length ? (
                  <Table label={t('orders.implementation')} 
                    cols={[
                    {label:t('form.date'), size: 4}, 
                    {label: t('form.name'), size: 4}, 
                    {label: t('form.duration'), size: 4}]} 
                    rows={timespanItems} />
                ) : (
                  <IonLabel slot="center" className="ion-padding">{t('text.norecords')}</IonLabel>
                )}
              </IonList>
              {getUserRole() === ROLE.WORKER && (
                <Fab
                  icon={Plus}
                  handleFabClick={() => handleFabClick(ROUTES.ORDER_TIMESPAN(String(id), String(operation.id)))}
                />
              )}
              <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={TOAST_DELAY}
                onDidDismiss={() => setToastMessage(null)}
              />
              </IonList>
            </>
          )}
        </IonContent>
      </>
    </IonPage>
  );
};

export default OrderOperations;

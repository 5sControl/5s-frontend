import React, { useEffect, useState } from 'react';
import { IonModal, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonChip } from '@ionic/react';
import { SelectConnection } from '../selectConnection/SelectConnection';
import { OperationsCheckbox } from '../operationsCheckbox/operationsCheckbox';
import { getFiltrationData, patchFiltrationData } from '../../../api/ordersView';
import { FiltrationData } from '../../../models/interfaces/filtrationData.interface';
import { useCookies } from 'react-cookie';

type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [cookies] = useCookies(['token']);
    const [operations, setOperations] = useState<FiltrationData[]>([]);
    const [changeConnectionHandler, setChangeConnectionHandler] = useState<boolean>(false);

    useEffect(() => {
        getFiltrationData(cookies.token)
          .then((res) => {
            const response = res.data;
            setOperations(response.sort((a: FiltrationData, b: FiltrationData) => a.operation_type_id - b.operation_type_id));
          })
          .catch((err) => console.log(err));
      },[changeConnectionHandler]);

    const submitHandler = () => {
        patchFiltrationData(cookies.token, operations)
          .then((response) => {
            onClose();
            onSave();
          })
          .catch((error) => console.log(error));
    };

    const changeHandler = (index: number) => {
        const allOperations = operations;
        allOperations[index] = {
          ...allOperations[index],
          is_active: !allOperations[index].is_active,
        };
        setOperations([...allOperations]);
    };

  return (
        <IonModal isOpen={isOpen} className='settingsModal'>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={onClose}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Orders View settings</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={submitHandler}>Done</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div>
                <h6>Work day</h6>
            </div>
            <div>
                <h6>Used ERP</h6>
                <SelectConnection changeHandler={setChangeConnectionHandler}/>
            </div>
            <div>
                <h6>Displayed operations ({operations.length})</h6>
                <OperationsCheckbox items={operations} handleSelectItem={changeHandler}/>
            </div>          
          </IonContent>
        </IonModal>

    
  );
};

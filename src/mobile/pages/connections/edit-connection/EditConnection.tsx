import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { ROUTES } from '../../../../shared/constants/routes';
import { useCookies } from 'react-cookie';
import { getConnectionsToDatabases } from '../../../api/connections';
import { capitalize } from '../../../utils/capitalize';
import { Input } from '../../../components/input/Input';
import { ConnectionItem } from '../../../models/interfaces/connectionItem.interface';

const EditConnection: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const { id } = useParams() as { id: string };
  const [currentConnection, setCurrentConnection] = useState<ConnectionItem>();
  const [changed, setChanged] = useState<boolean>(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [errorPopoverOpen, setErrorPopoverOpen] = useState(false);

  useEffect(() => {
    getConnectionsToDatabases('', cookies.token)
      .then(response => {
        const connection = response.data.find((connection: ConnectionItem) => connection.id === parseInt(id));
        setCurrentConnection(connection);
      })
      .catch(error => {
        console.error(error);
      });
  }, [])

  const openErrorPopover = (e: any) => {
    popover.current!.event = e;
    setErrorPopoverOpen(true);
  };

  const handleSaveClick = (e: any) => {
    openErrorPopover(e);
  }

  return (
    <IonContent>
      <IonHeader>
      <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium"></IonBackButton>
            </IonButtons>
            <IonTitle>{capitalize(currentConnection?.erp_system)} connection</IonTitle>
            <IonButton slot="end" size="small" color="primary" disabled={!changed} onClick={handleSaveClick}>Save</IonButton>
              <IonPopover ref={popover} isOpen={errorPopoverOpen} onDidDismiss={() => setErrorPopoverOpen(false)}>
                <IonContent class="ion-padding">Unable to save</IonContent>
              </IonPopover>
        </IonToolbar>
        <Input label="Domain" value={currentConnection?.host || ''} required={true} handleChange={() => setChanged(true)}/>
        <Input label="Name" value={currentConnection?.erp_system || ''} required={true} handleChange={() => setChanged(true)}/>
      </IonHeader>
    </IonContent>
  );
}

export default EditConnection;
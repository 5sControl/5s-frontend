import React, { useEffect, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { ROUTES } from '../../../../../shared/constants';
import { useCookies } from 'react-cookie';
import { getConnectionsToDatabases } from '../../../api/connections';
import { capitalize } from '../../../utils/capitalize';
import { Input } from '../../../components/input/Input';

const EditConnection: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const { id } = useParams() as { id: string };
  const [currentConnection, setCurrentConnection] = useState<ConnectionItem>();
  const [changed, setChanged] = useState<boolean>(false);

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

  return (
    <IonContent>
      <IonHeader>
      <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium"></IonBackButton>
            </IonButtons>
            <IonTitle>{capitalize(currentConnection?.erp_system)} connection</IonTitle>
            <IonButton slot="end" size="small" color="primary" disabled={!changed}>Save</IonButton>
        </IonToolbar>
        <Input label="Domain" value={currentConnection?.host || ''} required={true} handleChange={() => setChanged(true)}/>
        <Input label="Name" value={currentConnection?.erp_system || ''} required={true} handleChange={() => setChanged(true)}/>
      </IonHeader>
    </IonContent>
  );
}

export default EditConnection;
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonIcon, IonButtons, IonBackButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { getConnectionsToDatabases } from '../../api/connections';
import { useCookies } from 'react-cookie';
import { ConnectionsList } from '../../components/connectionsList/ConnectionsList';
import { ConnectionItem } from '../../models/interfaces/connectionItem.interface';

const Connections: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const [items, setItems] = useState<ConnectionItem[]>([])

  useEffect(() => {
    getConnectionsToDatabases('', cookies.token)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
            <IonTitle>ERP Connections</IonTitle>
        </IonToolbar>
      </IonHeader>
      {
        items.length === 0 
        ? 
        <IonList inset={true}>
          <IonItem>No databases available</IonItem>
        </IonList>
        : 
        <ConnectionsList items={items}></ConnectionsList>
      }
    </IonContent>
  );
};

export default Connections;
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { getConnectionsToDatabases } from '../../api/connections';
import { useCookies } from 'react-cookie';
import { ConnectionsList } from '../../components/connectionsList/ConnectionsList';
import { Preloader } from '../../../components/preloader'; 
import { ConnectionItem } from '../../models/interfaces/connectionItem.interface';
import { ROUTES } from '../../../shared/constants/routes';

const Connections: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const [items, setItems] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true); 
    getConnectionsToDatabases('', cookies.token)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cookies.token]);

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton text='' defaultHref={ROUTES.CONFIGURATION} color='medium'></IonBackButton>
          </IonButtons>
          <IonTitle>ERP Connections</IonTitle>
        </IonToolbar>
      </IonHeader>
      {loading ? ( 
        <div className='preloader'>
          <Preloader />
        </div>
      ) : (
        items.length === 0 ? (
          <IonList inset={true}>
            <IonItem>No databases available</IonItem>
          </IonList>
        ) : (
          <ConnectionsList items={items}></ConnectionsList>
        )
      )}
    </IonContent>
  );
};

export default Connections;
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonList, IonListHeader, IonLabel, IonSearchbar, IonItem } from '@ionic/react';
import React from 'react'
import { ROUTES } from '../../../shared/constants/routes';
import { useNavigate } from 'react-router-dom';

const Configuration = () => {
    const navigate = useNavigate();

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <IonContent>
          <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonBackButton text='' defaultHref={ROUTES.MENU} color='medium'></IonBackButton>
                </IonButtons>
              <IonTitle>Configuration</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList inset={true}>
            <IonItem button onClick={() => handleItemClick(ROUTES.CONNECTIONS)}>
                <IonLabel>ERP Connections</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      );
}

export default Configuration;
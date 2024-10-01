import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonList, IonListHeader, IonLabel, IonSearchbar, IonItem, IonSegment, IonSegmentButton } from '@ionic/react';
import React from 'react'
import { ROUTES } from '../../../shared/constants/routes';
import { useNavigate } from 'react-router-dom';

export const OrdersView = () => {
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
              <IonTitle>OrdersView</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className='ion-padding'>
            <IonListHeader>Oct 2 | 06:00 - 07:00</IonListHeader>
            <div>
            <IonSegment value="15min" scrollable={false}>
                <IonSegmentButton value="15min">
                    <IonLabel>15min</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="30min">
                    <IonLabel>30min</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="1h">
                    <IonLabel>1h</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="2h">
                    <IonLabel>2h</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="4h">
                    <IonLabel>4h</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="8h">
                    <IonLabel>8h</IonLabel>
                </IonSegmentButton>
            </IonSegment>
            </div>
          </div>
          
        </IonContent>
      );
}
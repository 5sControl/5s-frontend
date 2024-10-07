import React, { ReactNode } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

type HeaderProps = {
    title: ReactNode;
    backButtonHref?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, backButtonHref }) => {
  return (
    <IonHeader>
      <IonToolbar>
        { backButtonHref && <IonButtons slot="start">
          <IonBackButton text="" defaultHref={backButtonHref} color="medium"></IonBackButton>
        </IonButtons>}
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
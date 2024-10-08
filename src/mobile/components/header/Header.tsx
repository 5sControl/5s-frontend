import React, { ReactNode } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSearchbar } from '@ionic/react';

type HeaderProps = {
    title: ReactNode;
    backButtonHref?: string;
    endButton?: ReactNode;
    searchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, backButtonHref, endButton, searchBar }) => {
  return (
    <IonHeader className={searchBar ? '' : 'ion-no-border'}>
    <IonToolbar>
        {backButtonHref && 
            <IonButtons slot="start">
                <IonBackButton text="" defaultHref={backButtonHref} color="medium"></IonBackButton>
            </IonButtons>
        }
        <IonTitle>{title}</IonTitle>
        {endButton && <IonButtons slot="end">{endButton}</IonButtons>}
    </IonToolbar>
    {searchBar && <IonSearchbar placeholder="Search" />}
</IonHeader>
  );
};
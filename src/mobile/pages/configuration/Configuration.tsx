import { IonContent, IonList, IonLabel, IonItem } from '@ionic/react';
import React from 'react'
import { ROUTES } from '../../../shared/constants/routes';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { ItemButton } from '../../components/itemButton/ItemButton';

const Configuration = () => {
    const navigate = useNavigate();

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <IonContent>
          <Header title='Configuration' backButtonHref={ROUTES.MENU}/>
          <IonList inset={true}>
            <ItemButton label="ERP Connections" handleItemClick={() => handleItemClick(ROUTES.CONNECTIONS)} />
          </IonList>
        </IonContent>
      );
}

export default Configuration;
import React from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonIcon, IonButtons, IonBackButton, IonListHeader, IonSearchbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants';

const Database: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { title: 'Operations', path: 'operations', disabled: false },
    { title: 'Employees', path: 'employees', disabled: true },
    { title: 'Equipment', path: 'equipment', disabled: true },
    { title: 'Products', path: 'productCategories', disabled: false },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.MENU} color="medium"></IonBackButton>
            </IonButtons>
          <IonTitle>Database</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonList inset={true}>
        {items.map((item, index) => (
          <IonItem key={index} button disabled={item.disabled} onClick={() => handleItemClick(ROUTES.DATABASE_CATEGORY(item.path))}>
            <IonLabel>{item.title}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  );
};

export default Database;
import React from 'react';
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonToolbar, IonIcon, IonButtons, IonBackButton, IonListHeader, IonSearchbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { databaseTables } from '../../../shared/constants/databaseTables';

const Database: React.FC = () => {
  const navigate = useNavigate();

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
        {Object.values(databaseTables).map((table, index) => (
        table.pageDisplay && <IonItem key={index} button disabled={table.disabled} onClick={() => handleItemClick(ROUTES.DATABASE_CATEGORY(table.path))}>
            <IonLabel>{table.buttonTitle}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  );
};

export default Database;
import React from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { databaseTables } from '../../../shared/constants/databaseTables';
import { Header } from '../../components/header/Header';

const Database: React.FC = () => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <IonContent>
      <Header title="Database" backButtonHref={ROUTES.MENU} />
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
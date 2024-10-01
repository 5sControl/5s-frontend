import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants';
import { ConnectionItem } from '../../models/interfaces/connectionItem.interface';

type ConnectionsListProps = {
  items: ConnectionItem[];
};

export const ConnectionsList: React.FC<ConnectionsListProps> = ({ items }) => {
  const navigate = useNavigate();
  const handleAddConnection = () => {
    navigate(ROUTES.CONNECTIONS_ADD);
  }

  return (
    <>
      <IonList inset={true}>
          {items.map((item, index) => (
            <IonItem button key={index} onClick={() => navigate(ROUTES.CONNECTIONS_ITEM(item.id.toString()))}>
              <IonLabel className="capitalized">{item.erp_system}</IonLabel>
              <IonNote slot="end" color="medium">{item.is_active ? 'Used in Orders View' : 'Connected'}</IonNote>
            </IonItem>
          ))}
            <IonItem onClick={handleAddConnection}><IonLabel color='primary'>+ Add</IonLabel></IonItem>
      </IonList>
    </>
  );
};
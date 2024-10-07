import React, { useState, useEffect } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { ConnectionItem } from '../../models/interfaces/connectionItem.interface';
import { ItemButton } from '../itemButton/ItemButton';

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
          {items.map((item) => (
            <ItemButton 
            key={item.erp_system} 
            label={item.erp_system} 
            note={item.is_active ? 'Used in Orders View' : 'Connected'} 
            handleItemClick={() => navigate(ROUTES.CONNECTIONS_ITEM(item.id.toString()))} />
          ))}
            <IonItem onClick={handleAddConnection}><IonLabel color='primary'>+ Add</IonLabel></IonItem>
      </IonList>
    </>
  );
};
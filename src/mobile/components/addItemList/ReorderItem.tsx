import React from 'react'
import { DeleteRedIcon } from '../../assets/svg/SVGcomponent';
import { IonIcon, IonItem, IonLabel, IonReorder } from '@ionic/react';

type ReorderItemProps = {
    label: string,
    index: number,
    statusEditing: boolean,
    handleDelete: (index: number) => void
}

export const ReorderItem: React.FC<ReorderItemProps>= ({ label, index, statusEditing, handleDelete }) => (
    <IonItem>
      {statusEditing && (
        <IonIcon
          icon={DeleteRedIcon}
          color="danger"
          onClick={() => handleDelete(index)}
          slot="start"
        />
      )}
      <IonLabel>{label}</IonLabel>
      {statusEditing && <IonReorder slot="end" />}
    </IonItem>
  );

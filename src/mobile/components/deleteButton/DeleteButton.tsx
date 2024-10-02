import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import { DeleteRedIcon } from '../../assets/svg/SVGcomponent';
import React from 'react'

type DeleteButtonProps = {
    handleDeleteClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({handleDeleteClick}) => {
  return (
    <IonList inset={true} className="button__wrapper">
      <IonItem onClick={handleDeleteClick}>
        <IonIcon color="danger" aria-hidden="true" icon={DeleteRedIcon} slot="start"></IonIcon>
        <IonLabel color="danger">Delete</IonLabel>
      </IonItem>
    </IonList>
  )
}

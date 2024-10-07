import { IonItem, IonIcon, IonLabel, IonNote } from '@ionic/react'
import React from 'react'

type ItemButtonProps = {
    label: string,
    icon?: string,
    note?: string,
    handleItemClick?: any
    disabled?: boolean
    labelColor?: string
}

export const ItemButton: React.FC<ItemButtonProps> = ({label, icon, note, handleItemClick, disabled = false, labelColor})  => {
  return (
    <IonItem button onClick={handleItemClick} disabled={disabled}>
        {icon && <IonIcon aria-hidden="true" icon={icon} slot="start"></IonIcon>}
        <IonLabel color={labelColor || "dark"} className='capitalized'>{label}</IonLabel>
        {note && <IonNote slot="end" color="medium">{note}</IonNote>}
    </IonItem>
  )
}

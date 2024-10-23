import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import { chevronForward} from 'ionicons/icons';

const ItemList = ({label, to, disabled }:IItemList) => {
    return (
        <IonItem routerLink={to}  disabled={disabled}>
            <IonLabel>{label}</IonLabel>
        </IonItem>
    );
};

export default ItemList;

interface IItemList {
    label: string;
    to: string;
    disabled?: boolean;
}

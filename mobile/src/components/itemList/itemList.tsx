import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";

const ItemList = ({label, to, disabled, children }:IItemList) => {   

    return (
        <IonItem routerLink={to}  disabled={disabled}>
            {
                children ? children : <IonLabel>{label}</IonLabel>
            }
        </IonItem>
    );
};

export default ItemList;

interface IItemList {
    label?: string;
    to: string;
    disabled?: boolean;   
    children?: React.ReactNode; 
}
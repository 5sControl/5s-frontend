import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import { useHistory } from 'react-router';

const ItemList = ({label, to, disabled, children }:IItemList) => { 
    const history = useHistory();  

    return (
        <IonItem disabled={disabled} onClick={() => history.push(to)}>
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
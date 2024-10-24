import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import { chevronForward} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const ItemList = ({label, to, disabled, children }:IItemList) => {
    const history =useHistory();

    return (
        <IonItem onClick={()=>history.push(to)}  disabled={disabled}>
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

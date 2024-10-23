import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import { chevronForward} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const ItemList = ({label, to, disabled, children }:IItemList) => {
    const navigate = useNavigate();

    return (
        <IonItem onClick={()=>navigate(to)}  disabled={disabled}>
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

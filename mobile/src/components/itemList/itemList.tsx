import React from 'react';
import {IonIcon, IonItem, IonLabel} from "@ionic/react";
import { useHistory } from 'react-router';

const ItemList = ({label, to, disabled, children, navigationAllowed = true }:IItemList) => { 
    const history = useHistory();  

    const handleNavigateClick = () => {
        if (navigationAllowed) {
            history.push(to);
        }
    }

    return (
        <IonItem disabled={disabled} onClick={handleNavigateClick}>
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
    navigationAllowed?: boolean;
    children?: React.ReactNode; 
}
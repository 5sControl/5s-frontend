import React from 'react';
import {IonButton, IonContent, IonFooter, IonIcon, IonLabel, IonList, IonLoading, IonPage, IonText, IonItem} from "@ionic/react";

import DateIcon from './../../assets/svg/calendar.svg'
import style from './style.module.scss'

const InputDate = ({value, onClick}:IInputDate) => {
    return (
        <div className={style.date} onClick={onClick}>
            <IonLabel>{value}</IonLabel>
            <IonIcon icon={DateIcon}></IonIcon>
        </div>
    )
}

interface IInputDate {
    value: string;
    onClick: () => void
}

export default InputDate;
import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonLabel, IonList,
    IonModal,

} from '@ionic/react';
import styles from './styles.module.scss'
const ModalSave = ({ isModalOpen, setIsModalOpen, handleSubmit }: IModal) => {
    return (
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} >
            <IonList className={styles.list} >
                <IonLabel className={styles.label}>Save changes?</IonLabel>
                <IonList className={styles.list} class='ion-padding' >
                    <IonButton onClick={handleSubmit}>Confirm</IonButton>
                    <IonButton color="danger" fill='outline' onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </IonButton>
                </IonList>

            </IonList>

        </IonModal>
    )
}

interface IModal {
    isModalOpen: boolean;
    handleSubmit: () => void;
    setIsModalOpen: (v: boolean) => void
}

export default ModalSave;
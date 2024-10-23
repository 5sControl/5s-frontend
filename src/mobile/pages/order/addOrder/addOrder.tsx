import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFooter, IonInput, IonItem, IonLabel, IonList, IonLoading,
    IonModal,
    IonPage,
    IonTitle,
    IonToast,
    IonToolbar
} from '@ionic/react';
import { Header } from "../../../components/header/Header";
import ItemList from "../../../components/itemList/itemList";
import { useNavigate } from "react-router-dom";
import  ModalSave from  "../../../components/modalSave/modalSave";
import styles from './style.module.scss'
import { ORDER_REQUEST } from "../../../dispatcher";

const AddOrder: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const navigateTo = () => {
        navigate('../mobile/orders')
    }

    const handleSubmit = async () => {
        setIsModalOpen(false);
        ORDER_REQUEST.addOrder({ name: inputValue, operationIds: [] }, setLoading, setToastMessage, navigateTo)
    };
    const openModal = () => {
        setIsModalOpen(true);
    };


    const handleClick = () => {
        navigate('./operations/', { state: { message: inputValue } });
    };
    return (
        <IonPage color="light">
            <Header title="New Order" backButtonHref="../orders/" />
            <IonContent className="ion-padding">
                <IonLoading isOpen={isLoading} message="Submit..." />
                <IonList className={styles.page}>
                    <IonList className={styles.list}>
                        <IonLabel>Name</IonLabel>
                        <IonInput
                            fill="outline"
                            value={inputValue}
                            className="input__wrapper"
                            maxlength={50}
                            onIonInput={(e) => setInputValue(e.detail.value!)}
                        ></IonInput>
                    </IonList>
                    <IonList className={styles.list}>
                        <IonLabel>Operations</IonLabel>
                        <IonItem onClick={handleClick}>
                            <IonLabel>{`New Operations`}</IonLabel>
                        </IonItem>
                    </IonList>
                </IonList>

            </IonContent>
            <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || undefined}
                duration={3000}
                onDidDismiss={() => setToastMessage(null)}
            />
            <IonFooter style={{ paddingBottom: '50px' }} className="ion-padding">
                <IonButton
                    expand="block"
                    onClick={openModal}
                    disabled={!inputValue}
                >
                    Save
                </IonButton>
            </IonFooter>
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} ></ModalSave>           
        </IonPage>
    );
};

export default AddOrder;

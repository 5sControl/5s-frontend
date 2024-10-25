import React, { useState, useRef, useEffect } from 'react';
import {
    IonBackButton, IonButton, IonButtons,
    IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel,
    IonModal, IonText, IonTitle, IonToolbar, IonToast
} from '@ionic/react';
import { ROUTES } from "../../shared/constants/routes";
import { useHistory } from 'react-router-dom';
import style from './newOperation.module.scss';

const NewOperation: React.FC = () => {
    const [startDateTime, setStartDateTime] = useState<string | null>(null);
    const [finishDateTime, setFinishDateTime] = useState<string | null>(null);
    const [isSave, setSave] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);

    const history = useHistory();
    const startModalRef = useRef<HTMLIonModalElement>(null);
    const finishModalRef = useRef<HTMLIonModalElement>(null);
    const now = new Date().toISOString();

    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleStartNow = () => {
        if (startDateTime && startDateTime !== now) setSave(false);
        setStartDateTime(now);
    };

    const handleFinishNow = () => {
        if (!startDateTime) {
            showToastMessage('Please set the start date.');
            return;
        }
        if (new Date(now) < new Date(startDateTime)) {
            showToastMessage('The finish date cannot be earlier than the start date.');
            return;
        }
        if (finishDateTime && finishDateTime !== now) setSave(false);
        setFinishDateTime(now);
    };

    const handleSave = () => {
        if (!startDateTime) {
            showToastMessage('Please set a valid start date.');
        } else {
            setSave(true);
            showToastMessage('Data saved successfully!');
        }
    };

    const handleDateChange = (
        value: string | string[],
        setState: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (typeof value === 'string') {
            if (startDateTime && value > startDateTime) {
                if (value !== startDateTime) setSave(false);
                setState(value);
            } else {
                showToastMessage('The finish time must be after the start time.');
            }
        }
    };

    const handleStartDateChange = (
        value: string | string[],
        setState: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (typeof value === 'string') {
            if (finishDateTime && finishDateTime < value) {
                showToastMessage('The start time must be before the finish time.');
            } else {
                if (value !== finishDateTime) setSave(false);
                setState(value);
            }
        }
    };

    useEffect(() => {
        if ((!finishDateTime || !startDateTime) && isSave) setSave(false);
    }, [finishDateTime, startDateTime]);

    const backClick = () => {
        if (isSave || (!startDateTime && !finishDateTime)) {
            history.push(ROUTES.MENU);
        } else {
            showToastMessage('Please save your data!');
        }
    };

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={backClick}>
                        <IonBackButton text="" defaultHref="#" color="medium" />
                    </IonButtons>
                    <IonTitle>Implementation Time</IonTitle>
                </IonToolbar>
            </IonHeader>

            <div className="page-container">
                <div className="section">
                    <IonLabel>Start Of Operation</IonLabel>
                    <div className="content-box">
                        <div className="content-header">
                            {startDateTime ? (
                                <IonDatetimeButton datetime="start-datetime" slot="time-target" />
                            ) : (
                                <IonText className="ion-button-edit">Data</IonText>
                            )}
                            {startDateTime && (
                                <IonButton size="small" onClick={() => startModalRef.current?.present()}>
                                    Edit
                                </IonButton>
                            )}
                        </div>

                        <IonModal trigger="start-datetime" keepContentsMounted={true}>
                            <IonDatetime
                                id="start-datetime"
                                presentation="date-time"
                                value={startDateTime || undefined}
                                onIonChange={(e) => handleStartDateChange(e.detail.value!, setStartDateTime)}
                            />
                        </IonModal>

                        <IonModal ref={startModalRef}>
                            <IonDatetime
                                id="start-datetime"
                                presentation="time"
                                value={startDateTime || undefined}
                                onIonChange={(e) => handleStartDateChange(e.detail.value!, setStartDateTime)}
                            />
                        </IonModal>

                        <IonButton expand="block" onClick={handleStartNow} disabled={!!startDateTime}>
                            Start
                        </IonButton>
                    </div>
                </div>

                <div className="section">
                    <IonLabel>Finish Of Operation</IonLabel>
                    <div className="content-box">
                        <div className="content-header">
                            {finishDateTime ? (
                                <IonDatetimeButton datetime="finish-datetime" />
                            ) : (
                                <IonText className="ion-button-edit">Data</IonText>
                            )}
                            {finishDateTime && (
                                <IonButton size="small" onClick={() => finishModalRef.current?.present()}>
                                    Edit
                                </IonButton>
                            )}
                        </div>

                        <IonModal trigger="finish-datetime" keepContentsMounted={true}>
                            <IonDatetime
                                id="finish-datetime"
                                presentation="date-time"
                                value={finishDateTime || undefined}
                                onIonChange={(e) => handleDateChange(e.detail.value!, setFinishDateTime)}
                            />
                        </IonModal>

                        <IonButton expand="block" onClick={handleFinishNow} disabled={!!finishDateTime}>
                            Finish
                        </IonButton>
                    </div>
                </div>

                <IonButton
                    className="ion-button-save button"
                    expand="block"
                    onClick={handleSave}
                    disabled={isSave || !startDateTime}
                >
                    Save
                </IonButton>
            </div>

            <IonToast
                position="top"
                isOpen={showToast}
                message={toastMessage || undefined}
                duration={3000}
                onDidDismiss={() => setShowToast(false)}
            />
        </IonContent>
    );
};

export default NewOperation;
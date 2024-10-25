import React, { useState, useRef, useEffect } from 'react';
import {
    IonBackButton, IonButton, IonButtons,
    IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel,
    IonModal, IonText, IonTitle, IonToolbar, IonToast, IonIcon, IonPage, IonFooter, IonList, IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useParams } from "react-router";
import InputDate from '../../../components/inputDate/inputDate';
import { formatDate, getTimeDifference, mergeDateAndTime, updateTimeInDate, getCurrentDateTimeISO } from './../../../utils/parseInputDate'
import { TIMESPAN_REQUEST } from './../../../dispatcher'
import ModalSave from "../../../components/modalSave/modalSave";
import style from './style.module.scss'
import { Back } from './../../../assets/svg/SVGcomponent'
import { ROUTES } from "../../../shared/constants/routes";



const NewTimespan: React.FC = () => {
    const { id, operationId } = useParams<{ id: string, operationId: string }>();
    const [isDateChange, setIsDateChange] = useState<boolean>(false)
    const [startDateTime, setStartDateTime] = useState<string>(getCurrentDateTimeISO());
    const [isStart, setIsStart] = useState<boolean>(false)
    const [finishDateTime, setFinishDateTime] = useState<string>('');
    const [isSave, setSave] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const history = useHistory();
    const startModalRef = useRef<HTMLIonModalElement>(null);
    const finishModalRef = useRef<HTMLIonModalElement>(null);


    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleStartNow = () => {
        setStartDateTime(updateTimeInDate(startDateTime));
        setIsStart(true)
    };

    const handleFinishNow = () => {
        setFinishDateTime(startDateTime);
    };

    const handleNavigate = () => {
        history.push(ROUTES.ORDER_OPERATION(String(id), String(operationId)));
    };

    const handleSave = () => {
        if (!startDateTime) {
            showToastMessage('Please set a valid start date.');
        } else {
            setSave(true);
            operationId && TIMESPAN_REQUEST.addTimespan(parseInt(operationId), { startedAt: startDateTime, finishedAt: finishDateTime || '' }, setLoading, setToastMessage, handleNavigate)
        }
    };


    const handleStartDateChange = (date: string | string[]) => {
        if (Array.isArray(date)) return;
        if (finishDateTime) {
            setFinishDateTime(mergeDateAndTime(date, finishDateTime));
        }
        setStartDateTime(date);
    }

    const handleCustomTime = (time: string | string[]) => {
        if (Array.isArray(time)) return;
        if (finishDateTime && time > finishDateTime) {
            setToastMessage('The start time cannot be greater than the end time')
            return;
        }
        setStartDateTime(time);
    }
    const handleCustomFinishTime = (time: string | string[]) => {
        if (Array.isArray(time)) return;

        if (time < startDateTime) {
            setToastMessage('The finish date cannot be earlier than the start date. ')
            return;
        }
        setFinishDateTime(time);
    }

    useEffect(() => {
        isSave && setSave(false);
    }, [finishDateTime, startDateTime]);

    const backClick = () => {
        if (isSave || (!isStart && !finishDateTime)) {
            handleNavigate()
        } else {
            showToastMessage('Please save your data!');
        }
    };


    const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime)

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" className="header__start">
                        <IonButton onClick={backClick}>
                            <IonIcon style={{ fontSize: "18px" }} icon={Back} />
                        </IonButton>

                    </IonButtons>
                    <IonTitle>Implementation Time</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonLoading isOpen={isLoading} message="Loading..." />
                <IonList className={style.page}>
                    <IonList className={style.list}>
                        <IonLabel>Date</IonLabel>
                        <InputDate value={formatDate(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
                    </IonList>
                    <IonList className={style.sized}>
                        <IonLabel>Start Of Operation</IonLabel>
                        <div className={style.container}>
                            {isStart ? (
                                <IonDatetimeButton datetime="start-datetime" slot="time-target" onClick={(e) => { e.preventDefault }} />
                            ) : (
                                <IonText className="ion-button-edit">Data</IonText>
                            )}
                            {isStart && (
                                <IonButton size="small" onClick={() => startModalRef.current?.present()}>
                                    Edit
                                </IonButton>
                            )}
                        </div>

                        <IonModal isOpen={isDateChange} onDidDismiss={() => setIsDateChange(false)}>
                            <IonDatetime
                                presentation="date"
                                value={startDateTime}
                                onIonChange={(e) => handleStartDateChange(e.detail.value!)}
                            />
                        </IonModal>

                        <IonModal trigger="start-datetime" keepContentsMounted={true} style={{ display: 'none' }}>
                            <IonDatetime
                                id="start-datetime"
                                presentation="time"
                                value={startDateTime}
                                onIonChange={(e) => handleCustomTime(e.detail.value!)}
                            />
                        </IonModal>

                        <IonModal ref={startModalRef}>
                            <IonDatetime
                                id="start-datetime"
                                presentation="time"
                                value={startDateTime}
                                onIonChange={(e) => handleCustomTime(e.detail.value!)}
                            />
                        </IonModal>

                        <IonButton expand="block" onClick={handleStartNow} disabled={isStart}>
                            Start
                        </IonButton>
                    </IonList>


                    <IonList className={style.sized}>
                        <IonLabel>Finish Of Operation</IonLabel>
                        <div className={style.container}>
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


                        <IonModal trigger="finish-datetime" keepContentsMounted={true} style={{ display: 'none' }}>
                            <IonDatetime
                                id="finish-datetime"
                                presentation="time"
                                value={finishDateTime || undefined}
                                onIonChange={(e) => handleCustomFinishTime(e.detail.value!)}
                            />
                        </IonModal>
                        <IonModal ref={finishModalRef}>
                            <IonDatetime
                                id="finish-datetime"
                                presentation="time"
                                value={finishDateTime || undefined}
                                onIonChange={(e) => handleCustomFinishTime(e.detail.value!)}
                            />
                        </IonModal>

                        <IonButton expand="block" onClick={handleFinishNow} disabled={!isStart || !!finishDateTime}>
                            Finish
                        </IonButton>
                    </IonList>
                    <div className={style.time}>
                        <IonLabel>Operation time:</IonLabel>
                        <IonLabel>{`${hours}h ${minutes ? minutes + ' min' : ''}`}</IonLabel>
                    </div>
                    <IonToast
                        position="top"
                        isOpen={!!toastMessage}
                        message={toastMessage || undefined}
                        duration={3000}
                        onDidDismiss={() => setToastMessage(null)}
                    />
                </IonList>
            </IonContent>
            <IonFooter style={{ paddingBottom: '50px' }} className="ion-padding">
                <IonButton
                    expand="block"
                    onClick={openModal}
                    disabled={isSave || !isStart}
                >
                    Save
                </IonButton>

            </IonFooter>
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSave} ></ModalSave>

        </IonPage>
    );
};

export default NewTimespan;
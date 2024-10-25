import React, { useState, useRef, useEffect } from 'react';
import {
    IonIcon, IonButton, IonButtons,
    IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel,
    IonModal, IonText, IonTitle, IonToolbar, IonToast, IonPage, IonFooter, IonList, IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useParams } from "react-router";
import InputDate from '../../../components/inputDate/inputDate';
import { formatDateUTC, getTimeDifference, mergeDateAndTime, formatYMD, getCurrentDateTimeISO } from './../../../utils/parseInputDate'
import { TIMESPAN_REQUEST } from './../../../dispatcher'
import style from './styles.module.scss'
import { ITimespan } from './../../../models/interfaces/orders.interface'
import ModalSave from "../../../components/modalSave/modalSave";
import { Back } from './../../../assets/svg/SVGcomponent';
import { ROUTES } from "../../../shared/constants/routes";

const EditTimespan: React.FC = () => {
    const { timespanId, id, operationId } = useParams<{ timespanId: string, id: string, operationId: string }>();
    const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan)
    const [isDateChange, setIsDateChange] = useState<boolean>(false)
    const [startDateTime, setStartDateTime] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(true)
    const [finishDateTime, setFinishDateTime] = useState<string>('');
    const [isSave, setSave] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const history = useHistory();
    const startModalRef = useRef<HTMLIonModalElement>(null);
    const finishModalRef = useRef<HTMLIonModalElement>(null);

    const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime)



    useEffect(() => {
        timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, 10), setTimespan, setLoading, setToastMessage)
    }, [])

    useEffect(() => {
        if (timespan) {

            timespan.createdAt && setStartDateTime(formatYMD(timespan.startedAt));
            timespan.finishedAt && setFinishDateTime(formatYMD(timespan.finishedAt));
        }

    }, [timespan])

    const showToastMessage = (message: string) => {
        setToastMessage(message);
    };

    const handleNavigate = () => {
        history.push(ROUTES.ORDER_OPERATION(String(id), String(operationId)));
    };

    const handleSave = () => {
        if (!startDateTime) {
            showToastMessage('Please set a valid start date.');
        } else {
            timespanId && TIMESPAN_REQUEST.updateTimespan(parseInt(timespanId), { startedAt: startDateTime, finishedAt: finishDateTime || '' }, setLoading, setToastMessage, handleNavigate)
            setSave(true);
        }
    };

    const handleStartDateChange = (date: string | string[]) => {
        if (Array.isArray(date)) return;
        if (finishDateTime) {
            setFinishDateTime(mergeDateAndTime(date, finishDateTime));
        }
        setStartDateTime(date);
        setSave(false)
    }

    const handleCustomTime = (time: string | string[]) => {
        if (!startDateTime) setStartDateTime(getCurrentDateTimeISO())
        if (Array.isArray(time)) return;
        if (finishDateTime && time > finishDateTime) {
            setToastMessage('The start time cannot be greater than the end time')
            return;
        }
        setStartDateTime(time);
        setSave(false)
    }

    const handleCustomFinishTime = (time: string | string[]) => {
        if (!finishDateTime) setFinishDateTime(getCurrentDateTimeISO())
        if (Array.isArray(time)) return;
        if (time < startDateTime) {
            setToastMessage('The finish date cannot be earlier than the start date. ')
            return;
        }
        setFinishDateTime(time);
        setSave(false)
    }

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleFinishNow = () => {
        setFinishDateTime(startDateTime);
        setSave(false)
    };


    const backClick = () => {
        if (isSave) {
            handleNavigate()
        } else {
            showToastMessage('Please save your data!');
        }
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
            <IonLoading isOpen={isLoading} message="Loading..." />
            {
                startDateTime &&
                <>

                    <IonContent className="ion-padding">

                        <IonList className={style.page}>
                            <IonList className={style.list}>
                                <IonLabel>Date</IonLabel>
                                <InputDate value={formatDateUTC(startDateTime)} onClick={() => setIsDateChange(true)}></InputDate>
                            </IonList>
                            <IonList className={style.sized}>
                                <IonLabel>Start Of Operation</IonLabel>
                                <div className={style.container}>
                                    {isStart ? (
                                        <IonDatetimeButton datetime="start-datetime" slot="time-target" />
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
                                        value={startDateTime || undefined}
                                        onIonChange={(e) => handleCustomTime(e.detail.value!)}
                                    />
                                </IonModal>

                                <IonModal ref={startModalRef}>
                                    <IonDatetime
                                        id="start-datetime"
                                        presentation="time"
                                        value={startDateTime || undefined}
                                        onIonChange={(e) => handleCustomTime(e.detail.value!)}
                                    />
                                </IonModal>

                                <IonButton expand="block" disabled={true}>
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

                                <IonButton expand="block" onClick={handleFinishNow} disabled={!!finishDateTime}>
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
                            disabled={isSave}
                        >
                            Save
                        </IonButton>
                    </IonFooter>
                    <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSave} ></ModalSave>
                </>
            }
        </IonPage>
    );
};

export default EditTimespan;
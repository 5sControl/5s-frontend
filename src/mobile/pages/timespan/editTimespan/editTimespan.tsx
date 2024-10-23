import React, { useState, useRef, useEffect } from 'react';
import {
    IonBackButton, IonButton, IonButtons,
    IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonLabel,
    IonModal, IonText, IonTitle, IonToolbar, IonToast, IonPage, IonFooter, IonList, IonLoading
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";
import InputDate from '../../../components/inputDate/inputDate';
import { formatDate, updateDateTime, updateTime, getTimeDifference, getLocalDateString, mergeDateAndTime, localeFronString } from './../../../utils/parseInputDate'
import { TIMESPAN_REQUEST } from './../../../dispatcher'
import style from './styles.module.scss'
import { ITimespan } from './../../../models/interfaces/orders.interface'
import  ModalSave from  "../../../components/modalSave/modalSave";


const EditTimespan: React.FC = () => {
    const { timespanId, id, operationId } = useParams<{ timespanId: string, id: string, operationId: string }>();
    const [timespan, setTimespan] = useState<ITimespan>({} as ITimespan)
    const [isDateChange, setIsDateChange] = useState<boolean>(false)
    const [startDateTime, setStartDateTime] = useState<string>('');
    const [isStart, setIsStart] = useState<boolean>(true)
    const [finishDateTime, setFinishDateTime] = useState<string>('');
    const [isSave, setSave] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const startModalRef = useRef<HTMLIonModalElement>(null);
    const finishModalRef = useRef<HTMLIonModalElement>(null);
    const now = new Date().toISOString();


    useEffect(() => {
        timespanId && TIMESPAN_REQUEST.getTimespan(parseInt(timespanId, 10), setTimespan, setLoading, setToastMessage)
    }, [])

    useEffect(() => {
        if (timespan) {
            timespan.createdAt && setStartDateTime(localeFronString(timespan.createdAt))
            timespan.finishedAt && setFinishDateTime(timespan.finishedAt)
           
        }
    }, [timespan])

    useEffect(() => {
        if(startDateTime){
            if(startDateTime !== timespan.createdAt  ){
                setSave(false)
            }
        }
        if(finishDateTime){
            if(finishDateTime !== timespan.finishedAt){
                setSave(false)
            }
        }
    },[startDateTime, finishDateTime])

  

   

    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleStartNow = () => {
        if (startDateTime && startDateTime !== now) {
            setSave(false);
        }
      //  setStartDateTime(now);
        setIsStart(true)
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
        setFinishDateTime(getLocalDateString());

    };
    const handleNavigate = () => {
        navigate(`/mobile/order/${id}/operation/${operationId}`);
    };

    const handleSave = () => {
        if (!startDateTime) {
            showToastMessage('Please set a valid start date.');
        } else {
            timespanId && TIMESPAN_REQUEST.updateTimespan(parseInt(timespanId), { startedAt: startDateTime, finishedAt: finishDateTime || '' }, setLoading, setToastMessage, handleNavigate)
        }
    };


    const handleStartDateChange = (newTime: string | string[]) => {
        const changedTime = updateDateTime(startDateTime, newTime as string);
        if(finishDateTime){          
            setFinishDateTime(mergeDateAndTime(changedTime, finishDateTime));
        }
        setStartDateTime(changedTime);
    }
    const handleCustomTime = (time: string | string[]) => {
        if(!startDateTime) setStartDateTime(getLocalDateString())
        const changedTime = updateTime(startDateTime, time as string)
        if(finishDateTime && changedTime > finishDateTime){
            setToastMessage('the start time cannot be greater than the end time')
            return;
        }  
        setStartDateTime(changedTime);
    }
    const handleCustomFinishTime = (time: string | string[]) => {    
        const changedTime = updateTime(startDateTime, time as string)
        if(changedTime < startDateTime){
            setToastMessage('The finish date cannot be earlier than the start date. ')
            return;
        }   
        setFinishDateTime(changedTime);
    }

    const openModal = () => {
        setIsModalOpen(true);
    };


    const backClick = () => {
        // if(startDateTime === timespan.createdAt && finishDateTime === timespan.finishedAt){
        //     handleNavigate()
        // } else {
        //     showToastMessage('Please save your data!');
        // }
        handleNavigate()
    };

    console.log('stary:',startDateTime)
    console.log('fin:',finishDateTime)
    const { hours, minutes } = getTimeDifference(finishDateTime, startDateTime)

    return (

        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start" onClick={backClick}>
                        <IonBackButton text="" defaultHref="#" color="medium" />
                    </IonButtons>
                    <IonTitle>Edit Implementation Time</IonTitle>
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

                        <IonModal trigger="start-datetime" keepContentsMounted={true} style={{display: 'none'}}>
                            <IonDatetime
                                id="start-datetime"
                                presentation="time"
                                value={startDateTime || undefined}
                                onIonChange={(e) => handleStartDateChange(e.detail.value!)}
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

                        <IonButton expand="block"  disabled={true}>
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


                        <IonModal trigger="finish-datetime" keepContentsMounted={true} style={{display: 'none'}}>
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
                                value={startDateTime || undefined}
                                onIonChange={(e) => handleCustomFinishTime(e.detail.value!)}
                            />
                        </IonModal>

                        <IonButton expand="block" onClick={handleFinishNow} disabled={!isStart || !!finishDateTime}>
                            Finish
                        </IonButton>
                    </IonList>
                    <div className={style.time}>
                        <IonLabel>Общее кол-во часов:</IonLabel>
                        <IonLabel>{`${hours}ч ${minutes ? minutes + ' мин' : ''}`}</IonLabel>
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

        </IonPage>
    );
};

export default EditTimespan;

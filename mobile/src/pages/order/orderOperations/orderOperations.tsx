import React, {useEffect, useState} from 'react';
import {
    IonContent,
    IonIcon,
    IonLabel,
    IonList,
    IonPage,
    IonText,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonLoading, IonFab, IonFabButton
} from "@ionic/react";
import {Header} from "../../../components/header/Header";
import trashOutline from "../../../assets/svg/deleteRedOutlined.svg";
import style from "./orderOperations.module.scss";
import {useParams} from "react-router-dom";
import {IOperationSpan, IOrderOperation, IProductOperation} from "../../../models/interfaces/operationItem.interface";
import ItemList from "../../../components/itemList/itemList";
import {formatDate} from "../../../utils/parseInputDate";
import {ORDER_REQUEST} from "../../../dispatcher";
import {add} from "ionicons/icons";
import {formatTime} from './../../../utils/parseInputDate'
import { ROUTES } from "../../../shared/constants/routes";




const OrderOperations = () => {
    const {id, operationId} = useParams() as { id: string, operationId: string };
    const [operation, setOperation] = useState<IOrderOperation>({} as IOrderOperation)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null);


    const onDeleteHandle = () => {
        console.log('Delete')
    }
    useEffect(() => {
        ORDER_REQUEST.getOrderOperationsById(parseInt(id, 10),parseInt(operationId, 10),setOperation,setLoading,setToastMessage )
    }, []);

    const deleteIcon = <IonIcon icon={trashOutline} className={style.deleteIcon} onClick={onDeleteHandle}/>
    const timespanItems = operation?.timespans?.map(timespan => {
        const {hours,minutes} = formatTime(timespan.duration)
       
        const timestring = `${hours ? hours + ' h' : '' } ${minutes ? minutes + ' min' : '' }` 
    return <ItemList to={ROUTES.ORDER_TIMESPAN_EDIT(String(id), String(operationId), String(timespan.id))}

        key={timespan.id}>
        <IonGrid>
            <IonRow>
                <IonCol className={style.itemLabel}>
                    <IonLabel>{formatDate(timespan.startedAt)}</IonLabel>
                </IonCol>
                <IonCol className={style.itemLabel}>
                    <IonLabel>{timespan.employeeName}</IonLabel>
                </IonCol>
                <IonCol className={style.itemLabel}>
                    <IonLabel>{timestring}</IonLabel>
                </IonCol>
            </IonRow>
        </IonGrid>
    </ItemList>})
    if(!Object.values(operation)){
        return <IonLoading isOpen={true} message="Loading..."/>
    }
   
    return (
        <IonPage>
            <Header title={operation.name} backButtonHref={ROUTES.ORDER_ITEM(String(id))} />
            <IonContent className={"ion-padding"}>
                <IonLoading isOpen={isLoading} message="Loading..."/>
                <IonList className={style.page}>
                    <IonList className={style.list}>
                        <IonLabel>Operation</IonLabel>
                        <IonText>{operation.name}</IonText>
                    </IonList>
                    <IonList className={style.list}>
                        <IonLabel>Parts</IonLabel>
                        <ItemList label="Name Parts" to={``}></ItemList>
                    </IonList>
                    <IonList className={style.list}>
                        <IonLabel>Place</IonLabel>
                        <ItemList label="Name Place" to={``}></ItemList>
                    </IonList>
                    <IonList className={style.list}>
                        <IonLabel>Equipment</IonLabel>
                        <ItemList label="Name Equipment" to={``}></ItemList>
                    </IonList>
                    <IonList className={style.list}>
                        <IonLabel>Implementation</IonLabel>
                        {
                            timespanItems?.length ?
                             <>
                             <IonList>
                            <IonItem>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol className={style.itemLabel}>
                                            <IonLabel>Date</IonLabel>
                                        </IonCol>
                                        <IonCol className={style.itemLabel}>
                                            <IonLabel>Name</IonLabel>
                                        </IonCol>
                                        <IonCol className={style.itemLabel}>
                                            <IonLabel>Duration</IonLabel>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItem>
                            {timespanItems}
                        </IonList>
                             </>: <IonLabel slot='center'>No records</IonLabel>
                        }
                    </IonList>
                </IonList>
                <IonFab className={style.button} slot="fixed" horizontal="end" vertical="bottom">
                    <IonFabButton routerLink={ROUTES.ORDER_TIMESPAN(String(id),String(operation.id))} style={{'--border-radius': '15px'}}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>

        </IonPage>
    );
};

export default OrderOperations;
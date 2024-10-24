import React, { useEffect, useState } from 'react';
import { IonButton, IonContent, IonFooter, IonIcon, IonLabel, IonList, IonLoading, IonPage, IonText, IonToast } from "@ionic/react";
import { Header } from "../../components/header/Header";
import style from "./order.module.scss";
import ItemList from "../../components/itemList/itemList";
import { IOperation, IOrderWithAllOperations } from "../../models/interfaces/operationItem.interface";
import PencilIcon from "./../../assets/svg/editOutlined.svg"
import { useParams } from "react-router";
import { ORDER_REQUEST } from "../../dispatcher";
import { formatDate } from "../../utils/parseInputDate";

export interface IOrders {
    id: number
    name: string
    status: string
    createdAt: string
    updatedAt: string
    operations: IOperation[]
}

const Order = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<IOrderWithAllOperations>({} as IOrderWithAllOperations)

    const [isLoading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);


    useEffect(() => {
        id && ORDER_REQUEST.getOrder(parseInt(id, 10), setOrder, setLoading, setToastMessage)
    }, []);

    const items = order?.operations?.map(item => <ItemList key={item.id} label={item.name}
        to={`/mobile/order/${order.id}/operation/${item.id}`} />)


    return (
        <IonPage color="light">
            {
                isLoading ?  <IonLoading isOpen={isLoading} message="Loading..." /> :
                    <>
                        <Header title={order?.name} backButtonHref="/mobile/orders" />
                        <IonContent className="ion-padding">                           
                            <IonList className={style.list}>
                                <IonLabel>Name</IonLabel>
                                <IonText color="medium">
                                    <p>{order?.name}</p>
                                </IonText>
                            </IonList>
                            <IonList className={style.list}>
                                <IonLabel>Date</IonLabel>
                                <IonText color="medium">
                                    <p>{formatDate(order?.createdAt)}</p>
                                </IonText>
                            </IonList>
                            <IonList className={style.list}>
                                {
                                    items?.length ?
                                        <>
                                            <IonLabel>Operations</IonLabel>
                                            <IonList>
                                                {items}
                                            </IonList>
                                        </> : <IonLabel>No Operations</IonLabel>
                                }
                            </IonList>
                        </IonContent>
                        <IonFooter style={{ paddingBottom: '115px', display: 'flex', justifyContent: 'flex-end' }}
                            className="ion-padding">
                            <IonButton routerLink={`./mobile/order/${order.id}/edit`}>
                                <IonIcon icon={PencilIcon}></IonIcon>
                            </IonButton>
                        </IonFooter>
                    </>
            }
             <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage || undefined}
                    duration={3000}
                    onDidDismiss={() => setToastMessage(null)}
                />
        </IonPage>
    );
};

export default Order;

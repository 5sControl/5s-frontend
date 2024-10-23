import React, {useEffect, useState} from "react";
import {IonContent, IonFab, IonFabButton, IonIcon, IonList, IonLoading, IonToast} from "@ionic/react";
import {ROUTES} from "../../../shared/constants/routes";
import {Header} from "../../components/header/Header";
import ItemList from "../../components/itemList/itemList";
import style from './orders.module.scss'
import {add} from 'ionicons/icons';
import {IOrders} from "../../models/interfaces/orders.interface";
import {ORDER_REQUEST} from "../../dispatcher";

export const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<IOrders[]>([])
    const [searchText, setSearchText] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false)
    const [filteredItems, setFilteredItems] = useState<IOrders[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleSetSearch = (v: string) => setSearchText(v)
    useEffect(() => {
        const filtered = orders.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchText]);

    useEffect(() => {
        orders.length && setFilteredItems(orders)
    }, [orders]);

    useEffect(() => {
        ORDER_REQUEST.getOrders(setOrders, setLoading, setToastMessage)
    }, []);
   

    const items = filteredItems.map(item => <ItemList key={item.id} label={`${item.name}`} to={`../mobile/order/${item.id}`}/>)
    return (
        <IonContent color="light">
            {
                isLoading ? <IonLoading isOpen={isLoading} message="Loading..."/> :
                <>
                <Header title="Orders" backButtonHref={'/mobile/'} searchBar searchText={searchText} onSearchChange={handleSetSearch}/>
                <IonContent className="ion-padding">                    
                    <IonList>
                        {items}
                    </IonList>
                    <IonFab className={style.button} slot="fixed" horizontal="end" vertical="bottom">
                        <IonFabButton routerLink="./mobile/order/" style={{'--border-radius': '15px'}}>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>
                </IonContent>
                </>
            }
         

            <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage || undefined}
                    duration={3000}
                    onDidDismiss={() => setToastMessage(null)}
                />
        </IonContent>
    );
};



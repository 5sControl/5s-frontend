import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonModal, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { OrderItem } from "../../../models/interfaces/orderItem.interface";
import { useEffect, useState } from "react";
import "./SearchModal.scss";

type SearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (orderId: string) => void;
    orders: OrderItem[];
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelect, orders }) => {
    const [searchResult, setSearchResult] = useState<OrderItem[]>(orders);

    useEffect(() => {
        setSearchResult(orders);
    }, [orders]);
    
    const onSearch = (event: CustomEvent) => {
        const query = event.detail.value?.toLowerCase() || '';
        setSearchResult(orders.filter((order) => order.orId.toLowerCase().includes(query)));
    };

    return (
        <IonModal isOpen={isOpen} className='settingsModal'>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Order Search</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonSearchbar onIonInput={onSearch} />
                <IonList className="ordersSearchList">
                    {searchResult.map((order) => (
                        <IonItem key={order.orId} onClick={() => {onClose();onSelect(order.orId)}}>{order.orId}</IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonModal>
    );
};
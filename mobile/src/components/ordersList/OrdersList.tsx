import React from 'react'
import '../../styles/common.scss'
import { IonChip, IonLoading, IonSkeletonText, IonSpinner } from '@ionic/react'
import { OrderItem } from '../../models/interfaces/orderItem.interface'
import './OrdersList.scss'
import { SearchIcon } from '../../assets/svg/SVGcomponent'

type OrdersListProps = {
    loading: boolean;
    orders: OrderItem[],
    selectedOrderId: string;
    setSelectedOrderId: (orId: string) => void;
    setOpenSearchModal: (open: boolean) => void;
}
export const OrdersList: React.FC<OrdersListProps> = ({orders, selectedOrderId, setSelectedOrderId, loading, setOpenSearchModal}) => {

  return (
    <div className="orders-container">
      {loading 
        ? <IonSpinner name="crescent" color="primary" />
        : (
            <div className="orders">
                <img src={SearchIcon} onClick={() => setOpenSearchModal(true)}/>
                {orders.map((order) => (
                    <IonChip key={order.orId} onClick={() => setSelectedOrderId(order.orId)} className={order.orId === selectedOrderId ? "order selectedOrder" : "order"}>
                        {order.orId}
                    </IonChip>
                ))}
            </div>
        )}
    </div>
  );
}

import React from 'react'
import '../../../styles/common.scss'
import { IonChip, IonLoading, IonSkeletonText, IonSpinner } from '@ionic/react'
import { OrderItem } from '../../models/interfaces/orderItem.interface'
import './OrdersList.scss'

type OrdersListProps = {
    loading: boolean;
    orders: OrderItem[],
    selectedOrderId: string;
    setSelectedOrderId: (orId: string) => void;
}
export const OrdersList: React.FC<OrdersListProps> = ({orders, selectedOrderId, setSelectedOrderId, loading}) => {

  return (
    <div className="orders-container">
        <div className="orders">
        {loading 
        ? 
        <IonSpinner name="crescent" color="primary" />
        : orders.map((order) => (
              <IonChip key={order.orId} onClick={() => setSelectedOrderId(order.orId)} className={order.orId === selectedOrderId ? "order selectedOrder" : "order"}>
                {order.orId}
              </IonChip>
            ))}
        </div>
    </div>
  )
}

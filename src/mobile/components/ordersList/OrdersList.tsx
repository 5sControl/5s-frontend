import React from 'react'
import '../../../styles/common.scss'
import { IonChip } from '@ionic/react'
import { OrderItem } from '../../models/interfaces/orderItem.interface'

type OrdersListProps = {
    orders: OrderItem[]
}
export const OrdersList: React.FC<OrdersListProps> = ({orders}) => {

  return (
    <div className="orders-container">
        <div className="orders">
            {orders.map((order) => (
              <IonChip key={order.orId} color="dark">
                {order.orId}
              </IonChip>
            ))}
        </div>
    </div>
  )
}

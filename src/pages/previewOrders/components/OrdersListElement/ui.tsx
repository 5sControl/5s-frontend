import moment from 'moment';
import React from 'react';
import styles from './ordersListElement.module.scss';

type PropsType = {
  id: number;
  orderId: string;
  activeOrderId: number | null;
  status: string;
  onClick: (orderId: number) => void;
  orderDate: string;
};

export const OrdersListElement: React.FC<PropsType> = ({
  id,
  activeOrderId,
  status,
  onClick,
  orderId,
  orderDate,
}) => {
  let dateInfo = '';

  if (status.toLowerCase() === 'completed') {
    dateInfo = 'Completed';
  } else {
    dateInfo = moment(orderDate, 'YYYYMMDD').fromNow();
  }

  return (
    <div
      className={`${styles.listElement} ${activeOrderId === id && styles.active}`}
      onClick={() => onClick(id)}
    >
      <div
        className={`${styles.status} ${
          status === 'Completed'
            ? styles.statusCompleted
            : status === 'Started' && styles.statusStarted
        }`}
      />

      <div className={styles.orderInfo}>
        <h5 className={`${styles.orderName} ${activeOrderId === id && styles.activeOrder}`}>
          №{orderId}
        </h5>

        <h6 className={`${styles.orderDate}`}>{dateInfo}</h6>
      </div>
    </div>
  );
};

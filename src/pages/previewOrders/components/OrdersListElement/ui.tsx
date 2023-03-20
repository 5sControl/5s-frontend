import moment from 'moment-timezone';
import React from 'react';
import styles from './ordersListElement.module.scss';

type PropsType = {
  orderId: string;
  activeOrderId: string | null;
  status: string;
  onClick: (orderId: string) => void;
  orderDate: string;
};

export const OrdersListElement: React.FC<PropsType> = ({
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
      className={`${styles.listElement} ${activeOrderId === orderId && styles.active}`}
      onClick={() => onClick(orderId)}
    >
      <div
        className={`${styles.status} ${
          status === 'Completed'
            ? styles.statusCompleted
            : status === 'Started' && styles.statusStarted
        }`}
      />

      <div className={styles.orderInfo}>
        <h5 className={`${styles.orderName} ${activeOrderId === orderId && styles.activeOrder}`}>
          №{orderId}
        </h5>

        <h6 className={`${styles.orderDate}`}>{dateInfo}</h6>
      </div>
    </div>
  );
};

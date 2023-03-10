import React from 'react';
import styles from './ordersListElement.module.scss';

type PropsType = {
  orderId: string;
  activeOrderId: string | null;
  status: string;
  onClick: (orderId: string) => void;
};

export const OrdersListElement: React.FC<PropsType> = ({
  orderId,
  activeOrderId,
  status,
  onClick,
}) => {
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
      ></div>
      <h5 className={`${styles.title} ${activeOrderId === orderId && styles.activeTitle}`}>
        Order № {orderId}
      </h5>
    </div>
  );
};

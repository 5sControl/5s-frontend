import React from 'react';
import styles from './ordersListElement.module.scss';

type PropsType = {
  id: number;
  orderId: string;
  activeOrderId: number | null;
  status: string;
  onClick: (orderId: number) => void;
};

export const OrdersListElement: React.FC<PropsType> = ({
  id,
  activeOrderId,
  status,
  onClick,
  orderId,
}) => {
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
      ></div>
      <h5 className={`${styles.title} ${activeOrderId === id && styles.activeTitle}`}>
        Order № {orderId}
      </h5>
    </div>
  );
};

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addActiveOrder, selectActiveOrder } from './viewOrdersSlice';
import styles from './ordersListElement.module.scss';

type PropsType = {
  orderId: number;
  status: string;
};

export const OrdersListElement: React.FC<PropsType> = ({ orderId, status }) => {
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const dispatch = useAppDispatch();
  const onclickHandler = (orderId: number) => {
    dispatch(addActiveOrder(orderId));
  };

  return (
    <div
      className={`${styles.listElement} ${activeOrder === orderId && styles.active}`}
      onClick={() => onclickHandler(orderId)}
    >
      <div
        className={`${styles.status} ${
          status === 'Completed'
            ? styles.statusCompleted
            : status === 'Started' && styles.statusStarted
        }`}
      ></div>
      <h5 className={`${styles.title} ${activeOrder === orderId && styles.activeTitle}`}>
        Order № {orderId}
      </h5>
    </div>
  );
};

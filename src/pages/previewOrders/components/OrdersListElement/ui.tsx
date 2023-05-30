import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import styles from './ordersListElement.module.scss';
import { useAppSelector } from '../../../../store/hooks';
import { selectOrdersList } from '../OrdersList/ordersListSlice';
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
  const { search } = useAppSelector(selectOrdersList);
  const [indexIdArray, setIndexIdArray] = useState<string[]>([]);

  useEffect(() => {
    if (search) {
      const index = orderId.toUpperCase().indexOf(search.toUpperCase());
      const length = search.length;
      const firstPart = orderId.slice(0, index);
      const secondPart = orderId.slice(index + length, -1);
      setIndexIdArray([firstPart, search, secondPart]);
    }
  }, []);

  let dateInfo = '';

  if (status.toLowerCase() === 'completed') {
    dateInfo = 'Completed';
  } else {
    // тут подсчет даты сеньерский был
    dateInfo = orderDate.slice(0, 10);
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
          {search ? (
            <>
              {indexIdArray.map((element, index) => {
                return (
                  <span key={index} className={element === search ? styles.searchOrange : ''}>
                    {element.trim().toUpperCase()}
                  </span>
                );
              })}
            </>
          ) : (
            <>№{orderId}</>
          )}
        </h5>

        <h6 className={`${styles.orderDate}`}>{dateInfo}</h6>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { OrderItem } from '../../../../storage/orderView';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { OrdersListElement } from '../OrdersListElement';
import { selectActiveOrder, addActiveOrder } from './ordersListSlice';

import styles from './ordersList.module.scss';

type PropsType = {
  data: OrderItem[];
};

export const OrderList: React.FC<PropsType> = ({ data }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const dispatch = useAppDispatch();

  const onclickHandler = (orderId: number) => {
    dispatch(addActiveOrder(orderId));
  };

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  return (
    <Cover className={styles.list}>
      <h2 className={styles.title}>Orders</h2>
      <SearchInput className={styles.listInput} searchInputFilter={searchInputFilter} />

      <section className={styles.ordersListElement}>
        {data.map((item) => {
          return (
            <OrdersListElement
              key={item.orderId}
              orderId={item.orderId}
              activeOrderId={activeOrder}
              status={item.orderStatus}
              onClick={onclickHandler}
            />
          );
        })}
      </section>
    </Cover>
  );
};

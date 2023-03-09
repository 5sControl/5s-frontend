import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { OrderItem } from '../../../../storage/orderView';
import { OrdersListElement } from '../OrdersListElement';

import styles from './ordersList.module.scss';

type PropsType = {
  data: OrderItem[];
};

export const OrderList: React.FC<PropsType> = ({ data }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  const searchFilter = () => {
    return data.filter((item) => item.orderId.toString().includes(inputValue.toLowerCase()));
  };

  return (
    <Cover className={styles.list}>
      <h2 className={styles.title}>Orders</h2>
      <SearchInput className={styles.listInput} searchInputFilter={searchInputFilter} />

      <section className={styles.ordersListElement}>
        {searchFilter().map((item) => {
          return (
            <OrdersListElement
              key={item.orderId}
              orderId={item.orderId}
              status={item.orderStatus}
            />
          );
        })}
        {!searchFilter().length && <p className={styles.emptyList}>No matching orders found.</p>}
      </section>
    </Cover>
  );
};

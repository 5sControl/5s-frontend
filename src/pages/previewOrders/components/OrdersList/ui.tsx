import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { PreviewOrderItem } from '../../../../storage/orderView';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { OrdersListElement } from '../OrdersListElement';
import { selectActiveOrder, addActiveOrder } from './ordersListSlice';

import styles from './ordersList.module.scss';

type PropsType = {
  data: Array<PreviewOrderItem>;
};

export const OrderList: React.FC<PropsType> = ({ data }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const dispatch = useAppDispatch();

  const onclickHandler = (id: number) => {
    dispatch(addActiveOrder(id));
  };

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  const searchFilter = () => {
    return data.filter((item) => item.toString().includes(inputValue.toLowerCase()));
  };

  return (
    <Cover className={styles.list}>
      <h2 className={styles.title}>Orders</h2>
      <SearchInput className={styles.listInput} searchInputFilter={searchInputFilter} />

      <section className={styles.ordersListElement}>
        {searchFilter().map((item, index) => {
          return (
            <OrdersListElement
              key={index}
              orderId={item.orderId}
              activeOrderId={activeOrder}
              status={item.orderStatus}
              onClick={onclickHandler}
              id={item.id}
            />
          );
        })}
        {!searchFilter().length && <p className={styles.emptyList}>No matching orders found.</p>}
      </section>
    </Cover>
  );
};

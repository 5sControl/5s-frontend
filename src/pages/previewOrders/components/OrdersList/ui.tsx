import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { PreviewOrderItem } from '../../../../storage/orderView';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { OrdersListElement } from '../OrdersListElement';
import { selectActiveOrder, addActiveOrder } from './ordersListSlice';

import styles from './ordersList.module.scss';
import { PaginationBlock } from '../PaginationBlock';

type PropsType = {
  data: Array<PreviewOrderItem>;
  showPaginations?: boolean;
};

export const OrderList: React.FC<PropsType> = ({ data, showPaginations = false }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const dispatch = useAppDispatch();

  const onclickHandler = (id: string) => {
    dispatch(addActiveOrder(id));
  };

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  const searchFilter = () => {
    const sortData = data.filter((item) =>
      item.orderId.toString().toLowerCase().includes(inputValue.toLowerCase())
    );

    return sortData;
  };

  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Orders</h2>

        <SearchInput
          className={styles.listInput}
          searchInputFilter={searchInputFilter}
          placeholder={'Search order number'}
        />
      </div>

      <div className={`${styles.list} ${showPaginations ? styles.list_paginations : ''}`}>
        {searchFilter().map((item, index) => {
          return (
            <OrdersListElement
              key={index}
              orderId={item.orderId}
              activeOrderId={activeOrder}
              status={item.orderStatus}
              onClick={onclickHandler}
              orderDate={item.orderDateRealize}
            />
          );
        })}
        {!searchFilter().length && <p className={styles.list_empty}>No matching orders found.</p>}
      </div>

      {showPaginations && <PaginationBlock />}
    </Cover>
  );
};

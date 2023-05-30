import React from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { PreviewOrderItem } from '../../../../storage/orderView';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { OrdersListElement } from '../OrdersListElement';
import { addActiveOrder, selectOrdersList } from './ordersListSlice';

import styles from './ordersList.module.scss';
import { PaginationBlock } from '../PaginationBlock';
import { useNavigateSearch } from '../../../../functions/useNavigateSearch';

type PropsType = {
  data: Array<PreviewOrderItem>;
  isLoading: boolean;
  handleChangeSearch: (value: string) => void;
  handleClearList: () => void;
  showPaginations?: boolean;
  disabled?: boolean;
};

export const OrderList: React.FC<PropsType> = ({
  data,
  isLoading,
  handleChangeSearch,
  handleClearList,
  showPaginations = false,
  disabled,
}) => {
  const { activeOrder } = useAppSelector(selectOrdersList);
  const dispatch = useAppDispatch();
  const navigateSearch = useNavigateSearch();

  const handleClickToElement = (id: string) => {
    dispatch(addActiveOrder(id));

    const newQueryParams = {
      order_id: id,
    };
    navigateSearch('/orders-view', newQueryParams);
  };
  console.log(data);
  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Orders</h2>

        <SearchInput
          className={styles.listInput}
          placeholder={'Search order number'}
          disabled={disabled}
          handleClearList={handleClearList}
          handleChange={handleChangeSearch}
        />
      </div>

      <div className={`${styles.list} ${showPaginations ? styles.list_paginations : ''}`}>
        {isLoading
          ? 'Loading...'
          : data.map((item, index) => {
              return (
                <OrdersListElement
                  key={index}
                  orderId={item.orderId}
                  activeOrderId={activeOrder}
                  status={item.orderStatus}
                  onClick={handleClickToElement}
                  orderDate={item.orderDateRealize}
                />
              );
            })}

        {!data.length && !isLoading && (
          <p className={styles.list_empty}>No matching orders found.</p>
        )}
      </div>

      {showPaginations && <PaginationBlock disabled={disabled || isLoading} />}
    </Cover>
  );
};

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
  handleSubmitSearch: (value: string) => void;
  handleClearList: () => void;
  showPaginations?: boolean;
  disabled?: boolean;
};

export const OrderList: React.FC<PropsType> = ({
  data,
  isLoading,
  handleSubmitSearch,
  handleClearList,
  showPaginations = false,
  disabled,
}) => {
  const { activeOrder } = useAppSelector(selectOrdersList);
  const dispatch = useAppDispatch();
  const navigateSearch = useNavigateSearch();

  const handleClickToElement = (id: string) => {
    dispatch(addActiveOrder(id));
    navigateSearch('/orders-view', { order_id: id });
  };

  const handleClickSearchSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    handleSubmitSearch(event.target.search.value);
  };

  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.header_title}>Orders</h2>

        <SearchInput
          className={styles.listInput}
          placeholder={'Search order number'}
          disabled={disabled}
          handleSubmit={handleClickSearchSubmit}
          handleClearList={handleClearList}
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

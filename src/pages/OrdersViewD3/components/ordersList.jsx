import { useEffect, useState } from 'react';
import styles from './ordersList.module.scss';
import { SearchInput } from '../../../components/searchInput/searchInput';
import { getOrderViewOrderList } from '../../../api/orderView';

export const OrdersList = ({ setSelectOrder, selectOrder, startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getOrderViewOrderList(window.location.hostname, '', startDate, endDate).then((response) => {
      console.log(response);
      // const uniqueOrderNames = [...new Set(response.data.map((item) => item.orderId))];
      setData(response.data);
    });
  }, [startDate, endDate]);

  console.log(data);
  return (
    <div className={styles.orders}>
      <h2>Orders ({data.length})</h2>
      <SearchInput
        className={styles.listInput}
        placeholder={'Search order number'}
        // disabled={disabled}
        // handleClearList={handleClearList}
        // handleChange={handleChangeSearch}
      />
      <div className={styles.orders__list}>
        {data.map((item, index) => (
          <span
            key={index}
            className={`${styles.orders__item} ${
              selectOrder === item.orderId ? styles.select : ''
            }`}
            onClick={() => setSelectOrder(item.orderId)}
          >
            №{item.orderId}
          </span>
        ))}
      </div>
    </div>
  );
};

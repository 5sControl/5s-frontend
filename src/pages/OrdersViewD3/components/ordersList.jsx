import { useEffect, useState } from 'react';
import styles from './ordersList.module.scss';
import { SearchInput } from '../../../components/searchInput/searchInput';

export const OrdersList = ({ setSelectOrder, selectOrder, startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://5scontrol.pl/proxy_to_ngrok/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `https://0bc5-81-7-77-205.ngrok-free.app/api/new-order/orders/?from=${startDate}&to=${endDate}`,
        method: 'GET',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        const uniqueOrderNames = [...new Set(data.map((item) => item.orderName))];
        setData(uniqueOrderNames);
      });
  }, [startDate, endDate]);

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
            className={`${styles.orders__item} ${selectOrder === item ? styles.select : ''}`}
            onClick={() => setSelectOrder(item)}
          >
            №{item}
          </span>
        ))}
      </div>
    </div>
  );
};

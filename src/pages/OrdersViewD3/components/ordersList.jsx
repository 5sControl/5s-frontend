import { useEffect, useState } from 'react';
import styles from './ordersList.module.scss';
import { SearchInput } from '../../../components/searchInput/searchInput';
import { getOrderViewOrderList } from '../../../api/orderView';
import { Preloader } from '../../../components/preloader';
import { convertMillisecondsToTime } from '../../../functions/converterToMIlliseconds';

export const OrdersList = ({ setSelectOrder, selectOrder, startDate, endDate, reload }) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [preloader, setPreloader] = useState(false);
  useEffect(() => {
    if (!reload) {
      setPreloader(true);
      getOrderViewOrderList(window.location.hostname, '', startDate, endDate)
        .then((response) => {
          // const uniqueOrderNames = [...new Set(response.data.map((item) => item.orId))];
          setData(response.data);
          setPreloader(false);
        })
        .catch((error) => console.log(error));
    }
  }, [startDate, endDate, reload]);

  return (
    <div className={styles.orders}>
      <h2>Orders ({data.length})</h2>
      {preloader ? (
        // <Preloader />
        <div>Loading...</div>
      ) : (
        <>
          <SearchInput
            className={styles.listInput}
            placeholder={'Search order number'}
            // disabled={disabled}
            handleClearList={() => setSearchText('')}
            handleChange={(e) => setSearchText(e)}
          />
          <div className={styles.orders__list}>
            {data.length > 0 &&
              data.map(
                (item, index) =>
                  item.orId.includes(searchText) && (
                    <div
                      key={index}
                      className={`${styles.orders__item} ${
                        selectOrder === item.orId ? styles.select : ''
                      }`}
                      onClick={() => setSelectOrder(item.orId)}
                    >
                      {`№${item.orId}`}
                      &nbsp;<span>{` (${convertMillisecondsToTime(item.duration)})`}</span>
                    </div>
                  )
              )}
          </div>
        </>
      )}
    </div>
  );
};

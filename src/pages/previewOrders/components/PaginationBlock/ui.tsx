import { ChangeEvent } from 'react';
import { useCookies } from 'react-cookie';
import { Pagination } from '../../../../components/pagination';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { getOrdersAsync, selectOrdersList } from '../OrdersList/ordersListSlice';
import styles from './paginationBlock.module.scss';

const listOfData = [
  { id: 0, text: '25' },
  { id: 1, text: '50' },
  { id: 1, text: '100' },
];

type PropsType = {
  disabled?: boolean;
};

export const PaginationBlock: React.FC<PropsType> = ({ disabled }) => {
  const { ordersList, search, filterData } = useAppSelector(selectOrdersList);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const handlePages = (updatePage: number) => {
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: updatePage,
        page_size: ordersList?.records_on_page as number,
        search,
        params: filterData,
      })
    );
  };

  const handleChangeSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: 1,
        page_size: +target.value,
        search,
        params: filterData,
      })
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orders}>
        <span className={styles.orders_desc}>Orders per page:</span>

        <select
          value={ordersList?.records_on_page}
          onChange={handleChangeSelection}
          className={styles.orders_select}
          disabled={
            disabled ||
            (ordersList?.all_page_count as number) < (ordersList?.current_page as number)
          }
        >
          {listOfData.map((item, index) => (
            <option value={item.text} key={index}>
              {item.text}
            </option>
          ))}
        </select>
      </div>

      <Pagination
        page={ordersList?.current_page as number}
        totalPages={ordersList?.all_page_count as number}
        handlePagination={handlePages}
        disabled={disabled}
      />
    </div>
  );
};

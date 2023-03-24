import { ChangeEvent } from 'react';
import { useCookies } from 'react-cookie';
import { PaginationContainer } from '../../../../components/pagination';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { getOrdersAsync, selectPreviewOrders } from '../../previewOrdersSlice';
import styles from './paginationBlock.module.scss';

const listOfData = [
  { id: 0, text: '25' },
  { id: 1, text: '50' },
  { id: 1, text: '100' },
];

export const PaginationBlock: React.FC = () => {
  const { previewOrdersList } = useAppSelector(selectPreviewOrders);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const handlePages = (updatePage: number) => {
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: updatePage,
        limit: previewOrdersList?.records_on_page as number,
      })
    );
  };

  const handleChangeSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    dispatch(
      getOrdersAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: previewOrdersList?.current_page as number,
        limit: +target.value,
      })
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orders}>
        <span className={styles.orders_desc}>Orders per page:</span>

        <select
          value={previewOrdersList?.records_on_page}
          onChange={handleChangeSelection}
          className={styles.orders_select}
        >
          {listOfData.map((item, index) => (
            <option value={item.text} key={index}>
              {item.text}
            </option>
          ))}
        </select>
      </div>

      <PaginationContainer
        page={previewOrdersList?.current_page as number}
        totalPages={previewOrdersList?.all_page_count as number}
        handleSetPages={handlePages}
      />
    </div>
  );
};

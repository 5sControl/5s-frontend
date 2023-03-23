import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { PaginationContainer } from '../../../../components/pagination';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { getOrdersIdAsync, selectPreviewOrders } from '../../previewOrdersSlice';
import styles from './paginationBlock.module.scss';

const listOfData = [
  { id: 0, text: '25' },
  { id: 1, text: '50' },
  { id: 1, text: '100' },
];

export const PaginationBlock: React.FC = () => {
  const [dataSelect, setDataSelect] = useState<string>(listOfData[1].text);
  const { previewOrdersList } = useAppSelector(selectPreviewOrders);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);

  const handlePages = (updatePage: number) => {
    dispatch(
      getOrdersIdAsync({
        token: cookies.token,
        hostname: window.location.hostname,
        page: updatePage,
      })
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orders}>
        <span className={styles.orders_desc}>Orders per page:</span>

        <select
          value={dataSelect}
          onChange={(e) => setDataSelect(e.target.value)}
          className={styles.orders_select}
        >
          {listOfData.map((item) => (
            <option value={item.text} key={item.id}>
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

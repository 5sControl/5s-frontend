import React, { useEffect } from 'react';
import { Select } from '../../components/select/select';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import OrdersViewData from '../../storage/ordersView.json';
import { OrdersView } from '../../storage/orderView';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveOrder } from './components/OrdersList/ordersListSlice';
import { Cover } from '../../components/cover';
import { defenitionAsync, selectOrders } from './previewOrdersSlice';
import { useCookies } from 'react-cookie';

export const PreviewOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const [cookies] = useCookies(['token']);
  const { isLoading, error, orderdData } = useAppSelector(selectOrders);

  const listOfDate = [
    { id: 1, text: 'Last month, 2023 Jan 16 - Feb 16' },
    { id: 2, text: 'Last month, 2023 Feb 17 - Mar 16' },
    { id: 3, text: 'Last month, 2023 Mar 17 - Apr 16' },
    { id: 4, text: 'Last month, 2023 Apr 17 - May 16' },
  ];

  const listOfstatus = [
    { id: 1, text: 'Started' },
    { id: 2, text: 'Completed' },
  ];

  const data: OrdersView = OrdersViewData;

  useEffect(() => {
    dispatch(defenitionAsync({ token: cookies.token, hostname: window.location.hostname }));
    console.log('orderdData', orderdData);
  }, []);

  return (
    <WrapperPage>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Orders View</h2>

          {/* //  */}
          <div className={styles.selectContainer}>
            <Select listOfData={listOfstatus} />
            <Select className={styles.listOfDate} listOfData={listOfDate} />
          </div>
        </div>

        <div className={styles.body}>
          <OrderList data={data.orders} />

          {activeOrder ? (
            <OrderCard data={data.orders[activeOrder]} />
          ) : (
            <Cover className={styles.noOrder}>
              <h4 className={styles.title}>No order</h4>
              <p className={styles.subtitle}>Select an order from the list on the left</p>
            </Cover>
          )}
        </div>
      </div>
    </WrapperPage>
  );
};

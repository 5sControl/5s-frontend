import React from 'react';
import { Select } from '../../components/select/select';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import OrdersViewData from '../../storage/ordersView.json';
import { OrdersView } from '../../storage/orderView';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersListcopy';

export const PreviewOrders: React.FC = () => {
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

  return (
    <WrapperPage>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Orders View</h2>

          <div className={styles.selectContainer}>
            <Select listOfData={listOfstatus} />
            <Select className={styles.listOfDate} listOfData={listOfDate} />
          </div>
        </div>

        <div className={styles.body}>
          <OrderList data={data.orders} />

          <OrderCard data={data.orders[1]} />
        </div>
      </div>
    </WrapperPage>
  );
};

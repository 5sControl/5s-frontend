import React from 'react';
import { Cover } from '../../../../components/cover';
import { Select } from '../../../../components/select/select';
import { InventoryItem } from '../../../../storage/inventory';
import styles from './inventoryCard.module.scss';

type PropsType = {
  data: InventoryItem;
};
export const InventoryCard: React.FC<PropsType> = ({ data }) => {
  // ${
  //   data.status === 'In stock' && styles.statusStock
  // } ${data.status === 'Low stock level' && styles.statusLowStock} ${
  //   data.status === 'Out of stock' && styles.statusOutStock
  // }
  return (
    <Cover className={styles.cover}>
      <h4 className={styles.header}>Item 1</h4>

      <div className={styles.stockData}>
        <span className={`${styles.stockData_value}`}>14</span>
        <p className={styles.stockData_description}>in stock now</p>
      </div>

      <div className={styles.history}>
        <h6 className={styles.history_title}>Stock history</h6>
        <Select
          className={styles.history_date}
          listOfData={[
            { id: 1, text: 'Today, 21.02.2023' },
            { id: 2, text: '22.02.2023' },
          ]}
        />
      </div>
    </Cover>
  );
};

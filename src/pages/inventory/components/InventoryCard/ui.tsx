import React from 'react';
import { Cover } from '../../../../components/cover';
import { InventoryItem } from '../../types';
import { InventoryHistory } from '../InventoryHistory';
import styles from './inventoryCard.module.scss';

type PropsType = {
  data: InventoryItem;
};

export const InventoryCard: React.FC<PropsType> = ({ data }) => {
  return (
    <Cover className={styles.cover}>
      <h4 className={styles.header}>{data.name}</h4>

      <div className={styles.stockData}>
        <span className={`${styles.stockData_value}`}>{data.current_stock_level}</span>
        <p className={styles.stockData_description}>in stock now</p>
      </div>

      <InventoryHistory />
    </Cover>
  );
};

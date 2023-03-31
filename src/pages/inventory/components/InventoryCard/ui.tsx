import React, { useEffect } from 'react';
import { Cover } from '../../../../components/cover';
import { useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { InventoryItem } from '../../types';
import { InventoryHistory } from '../InventoryHistory';
import styles from './inventoryCard.module.scss';

type PropsType = {
  data: InventoryItem;
};

export const InventoryCard: React.FC<PropsType> = ({ data }) => {
  const { inventoryHistoryData, isLoadingHistory } = useAppSelector(selectInventory);
  useEffect(() => {
    console.log(isLoadingHistory);
  }, [isLoadingHistory]);
  return (
    <Cover className={styles.cover}>
      <h4 className={styles.header}>{data.name}</h4>

      {!isLoadingHistory &&
      inventoryHistoryData &&
      inventoryHistoryData[0] &&
      inventoryHistoryData[0].id ? (
        <div className={styles.stockData}>
          <span
            className={`${styles.stockData_value} ${
              inventoryHistoryData[inventoryHistoryData.length - 1].extra[0].status ===
                'In stock' && styles.stockIn
            } ${
              inventoryHistoryData[inventoryHistoryData.length - 1].extra[0].status ===
                'Low stock level' && styles.low
            } ${
              inventoryHistoryData[inventoryHistoryData.length - 1].extra[0].status ===
                'Out of stock' && styles.out
            }`}
          >
            {inventoryHistoryData[inventoryHistoryData.length - 1].extra[0].count}
          </span>
          <p className={styles.stockData_description}>in stock now</p>
        </div>
      ) : null}

      <InventoryHistory />
    </Cover>
  );
};

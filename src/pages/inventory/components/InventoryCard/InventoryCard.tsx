import React, { useEffect } from 'react';
import { Cover } from '../../../../components/cover';
import { useAppSelector } from '../../../../store/hooks';
import { getExtraOfActiveData } from '../../helper';
import { selectInventory } from '../../inventorySlice';
import { InventoryItem } from '../../types';
import { InventoryHistory } from '../InventoryHistory';
import { selectActiveInventoryItem } from '../InventoryItemsList/InventoryItemsListSlice';
import styles from './inventoryCard.module.scss';

type PropsType = {
  data: InventoryItem;
};

export const InventoryCard: React.FC<PropsType> = ({ data }) => {
  const { inventoryHistoryData, isLoadingHistory } = useAppSelector(selectInventory);
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  return (
    <Cover className={styles.cover}>
      {/* <h4 className={styles.header}>{data.name}</h4> */}

      {!isLoadingHistory &&
      inventoryHistoryData &&
      inventoryHistoryData[0] &&
      inventoryHistoryData[0].id ? (
        <div className={styles.stockData}>
          <span
            className={`${styles.stockData_value} ${
              getExtraOfActiveData(
                inventoryHistoryData[inventoryHistoryData.length - 1].extra,
                activeInventoryItem
              ).status === 'In stock' && styles.stockIn
            } ${
              getExtraOfActiveData(
                inventoryHistoryData[inventoryHistoryData.length - 1].extra,
                activeInventoryItem
              ).status === 'Low stock level' && styles.low
            } ${
              getExtraOfActiveData(
                inventoryHistoryData[inventoryHistoryData.length - 1].extra,
                activeInventoryItem
              ).status === 'Out of stock' && styles.out
            }`}
          >
            {/* {
              getExtraOfActiveData(
                inventoryHistoryData[inventoryHistoryData.length - 1].extra,
                activeInventoryItem
              ).count
            } */}
          </span>
          {/* <p className={styles.stockData_description}>in stock now</p> */}
        </div>
      ) : null}

      <InventoryHistory />
    </Cover>
  );
};

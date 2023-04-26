import React from 'react';
import { InventoryItem } from '../../types';
import styles from './inventoryListItem.module.scss';

type PropsType = {
  activeInvontoryItemId: InventoryItem | null;
  onClick: (orderId: InventoryItem) => void;
  itemDate: InventoryItem;
};

export const InventoryListItem: React.FC<PropsType> = ({
  activeInvontoryItemId,
  onClick,
  itemDate,
}) => {
  return (
    <div
      className={`${styles.listElement} ${
        activeInvontoryItemId && activeInvontoryItemId.id === itemDate.id && styles.active
      }`}
      onClick={() => onClick(itemDate)}
    >
      <h5
        className={`${styles.name} ${
          activeInvontoryItemId && activeInvontoryItemId.id === itemDate.id && styles.activeItem
        }`}
      >
        {itemDate.name}
      </h5>
    </div>
  );
};

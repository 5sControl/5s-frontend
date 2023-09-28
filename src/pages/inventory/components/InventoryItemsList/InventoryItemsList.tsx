import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { LocalSearchInput } from '../../../../components/localSearchInput';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectInventory } from '../../inventorySlice';
import { InventoryItem } from '../../types';
import { InventoryListItem } from '../InventoryListItem';
import styles from './inventoryItemsList.module.scss';
import { addActiveInventoryItem, selectActiveInventoryItem } from './InventoryItemsListSlice';

type PropsType = {
  data: Array<InventoryItem> | null;
};

export const InventoryItemsList: React.FC<PropsType> = ({ data }) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);
  const { inventoryItems, isLoading } = useAppSelector(selectInventory);

  const onclickHandler = (activeItem: InventoryItem) => {
    dispatch(addActiveInventoryItem(activeItem));
  };

  const searchFilter = (filterData: Array<InventoryItem>) => {
    const sortData = filterData.filter((item) =>
      item.name.toString().toLowerCase().includes(inputValue.toLowerCase())
    );

    return sortData;
  };

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Items</h2>

        <LocalSearchInput
          className={styles.listInput}
          searchInputFilter={searchInputFilter}
          placeholder="Search item"
        />
      </div>
      {inventoryItems && searchFilter(inventoryItems) ? (
        <div className={styles.list}>
          {searchFilter(inventoryItems).map((item, index) => {
            return (
              <InventoryListItem
                key={index}
                itemDate={item}
                activeInvontoryItemId={activeInventoryItem}
                onClick={onclickHandler}
              />
            );
          })}
        </div>
      ) : isLoading ? (
        <div className={styles.emptyList}>Loading...</div>
      ) : !isLoading ? (
        <div className={styles.emptyList}>No items found</div>
      ) : null}
    </Cover>
  );
};

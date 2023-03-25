import React from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';
import { InventoryItem } from '../../../../storage/inventory';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { InventoryListItem } from '../InventoryListItem';
import styles from './inventoryItemsList.module.scss';
import { addActiveInventoryItem, selectActiveInventoryItem } from './InventoryItemsListSlice';

type PropsType = {
  data: Array<InventoryItem>;
};

export const InventoryItemsList: React.FC<PropsType> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  const onclickHandler = (activeItem: InventoryItem) => {
    dispatch(addActiveInventoryItem(activeItem));
  };

  const searchFilter = (value: string) => {
    const sortData = data.filter((item) =>
      item.name.toString().toLowerCase().includes(value.toLowerCase())
    );

    return sortData;
  };

  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Items</h2>

        <SearchInput
          className={styles.listInput}
          // handleSearch={searchFilter}
          placeholder="Search item"
        />
      </div>

      <div className={styles.list}>
        {data.map((item, index) => {
          return (
            <InventoryListItem
              key={index}
              itemDate={item}
              activeInvontoryItemId={activeInventoryItem}
              onClick={onclickHandler}
            />
          );
        })}
        {!data.length && <p className={styles.emptyList}>No matching orders found.</p>}
      </div>
    </Cover>
  );
};

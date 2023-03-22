import React, { useState } from 'react';
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
  const [inputValue, setInputValue] = useState<string>('');
  const dispatch = useAppDispatch();
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  const onclickHandler = (activeItem: InventoryItem) => {
    dispatch(addActiveInventoryItem(activeItem));
  };

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  const searchFilter = () => {
    const sortData = data.filter((item) =>
      item.name.toString().toLowerCase().includes(inputValue.toLowerCase())
    );

    return sortData;
  };

  return (
    <Cover className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Items</h2>

        <SearchInput
          className={styles.listInput}
          searchInputFilter={searchInputFilter}
          placeholder="Search item"
        />
      </div>

      <div className={styles.list}>
        {activeInventoryItem &&
          searchFilter().map((item, index) => {
            return (
              <InventoryListItem
                key={index}
                itemDate={item}
                activeInvontoryItemId={activeInventoryItem}
                onClick={onclickHandler}
              />
            );
          })}
        {!searchFilter().length && <p className={styles.emptyList}>No matching orders found.</p>}
      </div>
    </Cover>
  );
};

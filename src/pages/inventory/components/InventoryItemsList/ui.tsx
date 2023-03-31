import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { LocalSearchInput } from '../../../../components/localSearchInput';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { InventoryItem } from '../../types';
import { InventoryListItem } from '../InventoryListItem';
import styles from './inventoryItemsList.module.scss';
import { addActiveInventoryItem, selectActiveInventoryItem } from './InventoryItemsListSlice';

type PropsType = {
  data: Array<InventoryItem>;
};

export const InventoryItemsList: React.FC<PropsType> = ({ data }) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const { activeInventoryItem } = useAppSelector(selectActiveInventoryItem);

  const onclickHandler = (activeItem: InventoryItem) => {
    dispatch(addActiveInventoryItem(activeItem));
  };

  const searchFilter = () => {
    const sortData = data.filter((item) =>
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

      <div className={styles.list}>
        {searchFilter().map((item, index) => {
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

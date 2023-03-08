import React, { useState } from 'react';
import { Cover } from '../../../../components/cover';
import { SearchInput } from '../../../../components/searchInput/searchInput';

import styles from './ordersList.module.scss';

export const OrderList: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  return (
    <Cover className={styles.list}>
      <h2 className={styles.title}>Orders</h2>
      <SearchInput className={styles.listInput} searchInputFilter={searchInputFilter} />
    </Cover>
  );
};

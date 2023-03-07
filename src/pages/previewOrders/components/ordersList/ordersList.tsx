import React, { useState } from 'react';
import { SearchInput } from '../../../../components/searchInput/searchInput';

import styles from './orderList.module.scss';

export const OrderList: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const searchInputFilter = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className={styles.list}>
      <h2 className={styles.title}>Orders</h2>
      <SearchInput className={styles.listInput} searchInputFilter={searchInputFilter} />
    </div>
  );
};

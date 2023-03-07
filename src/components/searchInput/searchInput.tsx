import React from 'react';
import { SearchIcon } from '../../assets/svg/SVGcomponent';
import styles from './searchInput.module.scss';

type PropsType = {
  searchInputFilter: (value: string) => void;
  className?: string;
};

export const SearchInput: React.FC<PropsType> = ({ className, searchInputFilter }) => {
  const filterList = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchInputFilter(e.target.value);
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <input
        id="search-input"
        type="text "
        className={styles.input}
        placeholder="Search order number "
        onChange={filterList}
      />
      <SearchIcon />
    </div>
  );
};

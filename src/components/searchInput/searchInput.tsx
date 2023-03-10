import React, { useRef, useState } from 'react';
import { SearchIcon, CloseCross } from '../../assets/svg/SVGcomponent';
import styles from './searchInput.module.scss';

type PropsType = {
  searchInputFilter: (value: string) => void;
  className?: string;
};

export const SearchInput: React.FC<PropsType> = ({ className, searchInputFilter }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const selectRef = useRef<HTMLInputElement>(null);
  const filterList = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchInputFilter(e.target.value);
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    if (selectRef && selectRef.current && selectRef.current.value) {
      selectRef.current.value = '';
      searchInputFilter('');
    }
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <input
        id="search-input"
        ref={selectRef}
        type="text "
        className={styles.input}
        placeholder="Search order number "
        onChange={filterList}
      />
      {!inputValue ? <SearchIcon /> : <CloseCross onClick={clearInput} className={styles.cross} />}
    </div>
  );
};

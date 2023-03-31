import React, { useRef, useState } from 'react';
import { SearchIcon, CloseCross } from '../../assets/svg/SVGcomponent';
import styles from './localSearchInput.module.scss';

type PropsType = {
  searchInputFilter: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const LocalSearchInput: React.FC<PropsType> = ({
  className,
  searchInputFilter,
  placeholder,
  disabled = false,
}) => {
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
      setInputValue('');
    }
  };
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <input
        id="search-input"
        ref={selectRef}
        type="text "
        className={styles.input}
        placeholder={placeholder}
        onChange={filterList}
        disabled={disabled}
      />
      {!inputValue ? <SearchIcon /> : <CloseCross onClick={clearInput} className={styles.cross} />}
    </div>
  );
};

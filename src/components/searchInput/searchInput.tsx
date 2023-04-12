import React, { useEffect, useState } from 'react';
import { CloseCross, SearchIcon } from '../../assets/svg/SVGcomponent';
import styles from './searchInput.module.scss';

type PropsType = {
  handleClearList?: () => void;
  handleChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const SearchInput: React.FC<PropsType> = ({
  className,
  handleChange,
  handleClearList,
  placeholder,
  disabled = false,
}) => {
  const [term, setTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState(term);

  const handleClear = () => {
    setTerm('');
    setDebouncedTerm('');
    handleClearList && handleClearList();
  };

  // update 'term' value after 1 second from the last update of 'debouncedTerm'
  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  // submit a new search
  useEffect(() => {
    if (term !== '') {
      handleChange && handleChange(term);
    }
    if (isFocused && term === '') {
      handleClearList && handleClearList();
    }
  }, [term]);

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <div className={styles.form}>
        <input
          id="search"
          type="text"
          name="search"
          value={debouncedTerm}
          className={styles.form_input}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => setDebouncedTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button type="button" className={styles.form_submit}>
          {!term ? <SearchIcon /> : <CloseCross onClick={handleClear} className={styles.cross} />}
        </button>
      </div>
    </div>
  );
};

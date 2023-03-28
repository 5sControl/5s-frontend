import React, { useState } from 'react';
import { CloseCross, SearchIcon } from '../../assets/svg/SVGcomponent';
import styles from './searchInput.module.scss';

type PropsType = {
  handleClearList?: () => void;
  handleSubmit?: (event: React.ChangeEvent<HTMLFormElement>) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const SearchInput: React.FC<PropsType> = ({
  className,
  handleSubmit,
  handleClearList,
  placeholder,
  disabled = false,
}) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue('');
    handleClearList && handleClearList();
  };

  const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    value.length > 0 && handleSubmit && handleSubmit(event);
  };

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          id="search"
          type="text"
          name="search"
          value={value}
          className={styles.form_input}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
        />
        <button type="button" className={styles.form_submit}>
          {!value ? <SearchIcon /> : <CloseCross onClick={handleClear} className={styles.cross} />}
        </button>
      </form>
    </div>
  );
};

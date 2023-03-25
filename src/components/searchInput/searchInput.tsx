import React from 'react';
import { SearchIcon } from '../../assets/svg/SVGcomponent';
import styles from './searchInput.module.scss';

type PropsType = {
  handleSubmit?: (event: React.ChangeEvent<HTMLFormElement>) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export const SearchInput: React.FC<PropsType> = ({
  className,
  handleSubmit,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          id="search"
          type="text"
          name="search"
          className={styles.form_input}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button type="submit" className={styles.form_submit}>
          <SearchIcon />
        </button>
      </form>
    </div>
  );
};

import { useState } from 'react';
import { SearchIcon } from '../../assets/svg/SVGcomponent';
import styles from './input.module.scss';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
type PropsType = {
  id: string;
  name: string;
  type: string;
  showEye?: boolean;
  showSearch?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  className?: any;
  onKeyDown?: () => void;
  min?: number;
  errorMessage?: string | null;
};

export const Input: React.FC<PropsType> = ({
  id,
  name,
  type,
  onChange,
  placeholder,
  value,
  defaultValue,
  label,
  disabled,
  showEye,
  showSearch,
  required,
  className,
  onKeyDown,
  min,
  errorMessage,
}) => {
  const [inputType, setInputType] = useState(type);

  const handleClickToEye = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required_label}>{' *'}</span>}
        </label>
      )}

      <div className={styles.block}>
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          className={`${className ? className : styles.block__input} ${
            errorMessage && styles.block__error
          }`}
          onKeyDown={onKeyDown}
          min={min}
        />

        {errorMessage && <span className={styles.block__error_message}>{errorMessage}</span>}
        {showEye && inputType === 'text' && (
          <AiFillEyeInvisible className={styles.block__eye} onClick={handleClickToEye} />
        )}
        {showEye && inputType === 'password' && (
          <AiFillEye className={styles.block__eye} onClick={handleClickToEye} />
        )}
        {showSearch && <SearchIcon className={styles.block__search} />}
      </div>
    </div>
  );
};

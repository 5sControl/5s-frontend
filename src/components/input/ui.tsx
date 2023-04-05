import { useState } from 'react';
import { Eye } from '../../assets/svg/SVGcomponent';
import styles from './input.module.scss';

type PropsType = {
  id: string;
  name: string;
  type: string;
  showEye?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
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
  required,
}) => {
  const [inputType, setInputType] = useState(type);

  const handleClickToEye = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
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
          className={styles.block__input}
        />

        {showEye && <Eye className={styles.block__eye} onClick={handleClickToEye} />}
      </div>
    </div>
  );
};

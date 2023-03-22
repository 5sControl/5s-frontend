import styles from './input.module.scss';

type PropsType = {
  id: string;
  name: string;
  type: string;
  onChange: () => void;
  placeholder?: string;
  value?: string;
  label?: string;
  disabled?: boolean;
};

export const Input: React.FC<PropsType> = ({
  id,
  name,
  type,
  onChange,
  placeholder,
  value,
  label,
  disabled,
}) => {
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id}>{label}</label>}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

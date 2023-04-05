import styles from './checkbox.module.scss';

type PropsType = {
  id: string;
  name: string;
  label: string;
  value: string;
  isChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const Checkbox: React.FC<PropsType> = ({
  id,
  name,
  label,
  value,
  isChecked,
  onChange,
  className,
}) => {
  return (
    <div className={`${styles.content} ${className}`}>
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

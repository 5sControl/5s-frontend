import styles from './checkbox.module.scss';

type PropsType = {
  id: string;
  name: string;
  label: string;
  value: string;
  isChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<PropsType> = ({ id, name, label, value, isChecked, onChange }) => {
  return (
    <div className={styles.content}>
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

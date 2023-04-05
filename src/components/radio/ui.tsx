import styles from './radio.module.scss';

type PropsType = {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Radio: React.FC<PropsType> = ({ id, name, value, label, checked, onChange }) => {
  return (
    <div className={styles.content}>
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

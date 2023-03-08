import styles from './styles.module.scss';

type PropsType = {
  type: string;
};

export const StatusLable: React.FC<PropsType> = ({ type }) => {
  return (
    <div className={`${styles.lable} ${styles[type.toLocaleLowerCase()]}`}>
      <span className={styles.type}>{type}</span>
    </div>
  );
};

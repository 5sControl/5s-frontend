import styles from './statusLable.module.scss';

type PropsType = {
  status: string;
  type?: 'text' | 'contained';
};

export const StatusLable: React.FC<PropsType> = ({ type = 'contained', status }) => {
  const className = styles[`${type}_${status.toLocaleLowerCase()}`];

  return (
    <div className={className}>
      <span className={styles.type}>{status}</span>
    </div>
  );
};

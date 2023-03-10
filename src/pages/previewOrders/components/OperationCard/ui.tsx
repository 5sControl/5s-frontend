import { OperationItem } from '../../../../storage/orderView';
import styles from './operationCard.module.scss';

type PropsType = {
  data: OperationItem;
  onClick: () => void;
};

export const OperationCard: React.FC<PropsType> = ({ data, onClick }) => {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <p className={styles.title}>{data.operationName}</p>
      <p className={styles.date}>{data.operationTime}</p>
    </div>
  );
};

import { OperationItem } from '../../../../storage/orderView';
import styles from './operationCard.module.scss';

type PropsType = {
  data: OperationItem;
};

export const OperationCard: React.FC<PropsType> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{data.operationName}</p>
      <p className={styles.date}>{data.operationTime}</p>
    </div>
  );
};

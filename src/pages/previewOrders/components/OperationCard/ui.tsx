import moment from 'moment-timezone';
import { VideoCamera } from '../../../../assets/svg/SVGcomponent';
import { OperationItem } from '../../../../storage/orderView';
import styles from './operationCard.module.scss';

type PropsType = {
  data: OperationItem;
  onClick: (operationData: OperationItem) => void;
};

export const OperationCard: React.FC<PropsType> = ({ data, onClick }) => {
  const operationTime = moment(data.operationTime).tz('Etc/GMT').format('LT');

  const handleClickToOperationCard = () => {
    onClick(data);
  };

  return (
    <div className={styles.wrapper} onClick={handleClickToOperationCard}>
      <div className={styles.titleBlock}>
        <p className={styles.title}>{data.operationName}</p>
        <VideoCamera />
      </div>

      <p className={styles.subtitle}>{'Worker Wazowski'}</p>
      <p className={styles.subtitle}>{operationTime}</p>
    </div>
  );
};

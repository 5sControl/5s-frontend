import moment from 'moment-timezone';
import {
  CheckCircle,
  Error,
  QuestionSquere,
  VideoCamera,
} from '../../../../assets/svg/SVGcomponent';
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
      <div className={styles.block}>
        <p className={styles.block_title}>{data.operationName}</p>
        <VideoCamera />
      </div>

      <p className={styles.subtitle}>{'Worker Wazowski'}</p>

      <div className={styles.footer}>
        <p className={styles.footer_time}>{operationTime}</p>

        {data.report.violation_found === undefined && (
          <QuestionSquere color={'var(--LowEmphasis)'} />
        )}
        {data.report.violation_found && <Error color={'var(--Red)'} />}
        {data.report.violation_found === false && <CheckCircle color={'var(--Green)'} />}
      </div>
    </div>
  );
};

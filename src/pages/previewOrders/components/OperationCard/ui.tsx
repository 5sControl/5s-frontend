import {
  CheckCircle,
  Error,
  QuestionSquere,
  VideoCamera,
  VideoCameraCrossed,
} from '../../../../assets/svg/SVGcomponent';
import { OperationItem } from '../../../../storage/orderView';
import styles from './operationCard.module.scss';

type PropsType = {
  data: OperationItem;
  onClick: (operationData: OperationItem) => void;
};

export const OperationCard: React.FC<PropsType> = ({ data, onClick }) => {
  const operationTime = new Date(data.operationTime).toLocaleTimeString();

  const handleClickToOperationCard = () => {
    if (data.video_data.status) {
      onClick(data);
    }
  };

  return (
    <div
      className={`${styles.wrapper} ${data.video_data.status ? '' : styles.wrapper_opasity}`}
      onClick={handleClickToOperationCard}
    >
      <div className={styles.block}>
        <p className={styles.block_title}>{data.operationName}</p>
        {data.video_data.status ? (
          <VideoCamera width='16px' color='var(--MediumEmphasis)' />
        ) : (
          <VideoCameraCrossed width='16px' color='var(--MediumEmphasis)' />
        )}
      </div>

      <p className={styles.footer_text}>{data.operationWorker}</p>

      <div className={styles.footer}>
        <p className={styles.footer_text}>{operationTime}</p>

        {data.status === null && <QuestionSquere color={'var(--LowEmphasis)'} />}
        {data.status && <Error color={'var(--Red)'} />}
        {data.status === false && <CheckCircle color={'var(--Green)'} />}
      </div>
    </div>
  );
};

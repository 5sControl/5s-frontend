import moment from 'moment';
import styles from './operation.module.scss';

export const Operation = ({ operation, x, y }) => {
  return (
    <div className={styles.operation} style={{ top: y, left: x }}>
      <span className={styles.name}>{operation.operationName}</span>
      <span className={styles.video}>
        {operation.video_data && operation.video_data.status ? 'video' : 'no video'}
      </span>
      <span className={styles.name}>{`${operation.firstName} ${operation.lastName}`}</span>
      <span className={styles.respTime}>{`${moment(operation.startTime).format(
        'HH:mm:ss'
      )} - ${moment(operation.endTime).format('HH:mm:ss')}`}</span>
    </div>
  );
};

import moment from 'moment';

import { Camera, Algorithm } from '../../../../assets/svg/SVGcomponent';
import { addCurrentReport, selectCurrentReport } from '../../../../store/dataSlice';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';

import styles from './reports.module.scss';

export const ReportListItem = ({ item }) => {
  const dispatch = useAppDispatch();
  const { currentReport } = useAppSelector(selectCurrentReport);
  return (
    <div
      className={
        currentReport.id === item.id
          ? `${styles.active} ${styles.reports_item}`
          : styles.reports_item
      }
      onClick={() => dispatch(addCurrentReport(item))}
    >
      <div className={styles.inside}>
        <div className={`${item.violation_found ? styles.red : styles.green}`}></div>
        <div className={styles.inside_content}>
          <div className={styles.reports_item_title}>
            {moment.utc(item.start_tracking).utcOffset(moment().utcOffset()).format('YYYY-MM-DD ')}{' '}
            | {moment.utc(item.start_tracking).utcOffset(moment().utcOffset()).format('HH:mm:ss')} -{' '}
            {moment.utc(item.stop_tracking).utcOffset(moment().utcOffset()).format('HH:mm:ss')}
          </div>

          <div>{`# ${item.id}`}</div>
          <div>
            <Camera /> {item.camera ? item.camera.name : 'Deleted camera'}
          </div>
          <div>
            <Algorithm style={{ fill: '#666666' }} />
            {parsingAlgorithmName(item.algorithm.name)}
          </div>
        </div>
      </div>
    </div>
  );
};

import moment from 'moment';

import { Camera, Algorithm } from '../../../../assets/svg/SVGcomponent';
import { addCurrentReport, selectCurrentReport } from '../../../../store/dataSlice';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';

import styles from './reports.module.scss';

export const ReportListItem = ({ item }) => {
  const dispatch = useAppDispatch();
  const { currentReport } = useAppSelector(selectCurrentReport);
  const startTracking = moment.utc(item.start_tracking).utcOffset(moment().utcOffset());
  const stopTracking = moment.utc(item.stop_tracking).utcOffset(moment().utcOffset());
  const duration = moment.duration(stopTracking.diff(startTracking));
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes}min `;
  }
  formattedDuration += seconds < 10 ? `${seconds}s` : `${seconds}s`;

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
            {startTracking.format('HH:mm:ss')} - {stopTracking.format('HH:mm:ss ')}
            <span>| {formattedDuration}</span>
          </div>

          <div>{`# ${item.id}`}</div>
          <div>
            <Camera />{' '}
            {item.camera
              ? `${
                  item.extra && item.extra.zoneName
                    ? `${item.camera.name} | ${item.extra.zoneName}`
                    : item.camera.name
                }`
              : 'Deleted camera'}
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

import moment from 'moment';
import { Camera, Algorithm } from '../../../../assets/svg/SVGcomponent';
import { addCurrentReport, selectCurrentReport } from '../../../../store/dataSlice';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';

export const ReportListItem = ({ item }) => {
  const dispatch = useAppDispatch();
  const { currentReport } = useAppSelector(selectCurrentReport);

  return (
    <>
      <div
        className={
          currentReport.id === item.id
            ? 'dashboard__reports_item active'
            : 'dashboard__reports_item'
        }
        onClick={() => dispatch(addCurrentReport(item))}
      >
        <div className="dashboard__reports_item_container">
          <div
            className={`dashboard__reports_item_container_status_${
              item.violation_found ? 'red' : 'green'
            }`}
          ></div>
          <div className="dashboard__reports_item_container_content">
            <div className={'dashboard__reports_item_title'}>
              {moment.utc(item.start_tracking).utcOffset(moment().utcOffset()).format('YYYY-MM-DD')}{' '}
              | {moment.utc(item.start_tracking).utcOffset(moment().utcOffset()).format('HH:mm:ss')}{' '}
              - {moment.utc(item.stop_tracking).utcOffset(moment().utcOffset()).format('HH:mm:ss')}
            </div>

            <div>{`# ${item.id}`}</div>
            <div>
              <Camera /> {item.camera.name}
            </div>
            <div>
              <Algorithm style={{ fill: '#666666' }} />
              {parsingAlgorithmName(item.algorithm.name)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

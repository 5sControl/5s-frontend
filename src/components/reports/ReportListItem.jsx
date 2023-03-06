import moment from 'moment';
import { Camera, Algorithm } from '../../assets/svg/SVGcomponent';
import { useDispatch, useSelector } from 'react-redux';
import { addCurrentReport } from '../../store/dataSlice';
import { parsingAlgorithmName } from '../../functions/parsingAlgorithmName';

export const ReportListItem = ({ item }) => {
  const dispatch = useDispatch();
  const currentReport = useSelector((state) => state.currentReport.report);
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
              {moment(new Date(item.start_tracking)).add(3, 'hours').format('YYYY-MM-DD')} |{' '}
              {moment(new Date(item.start_tracking)).add(3, 'hours').format('HH:mm:ss')} -{' '}
              {moment(new Date(item.stop_tracking)).add(3, 'hours').format('HH:mm:ss')}
            </div>

            <div>{`# ${item.id}`}</div>
            <div>
              <Camera /> {item.camera.name}
            </div>
            <div>
              <Algorithm />
              {parsingAlgorithmName(item.algorithm.name)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

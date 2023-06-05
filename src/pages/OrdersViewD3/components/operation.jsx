import '../style.scss';
import moment from 'moment';
export const Operation = ({ operation, x, y }) => {
  return (
    <div className="operation" style={{ top: y, left: x }}>
      <span className="name">{operation.operationName}</span>
      <span className="video">
        {operation.video_data && operation.video_data.status ? 'video' : 'no video'}
      </span>
      <span className="name">{`${operation.firstName} ${operation.lastName}`}</span>
      <span className="respTime">{`${moment(operation.startTime).format('HH:mm:ss')} - ${moment(
        operation.endTime
      ).format('HH:mm:ss')}`}</span>
    </div>
  );
};

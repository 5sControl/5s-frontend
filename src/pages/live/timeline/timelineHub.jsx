import { Timeline } from './timeline';
import { calculateTimeCenter } from '../../../functions/calculateTimeCenter';
import { Fragment } from 'react';

export const TimelineHub = ({
  data,
  startDate,
  endDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}) => {
  const algorithm = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.algorithm.name])];
  }, []);
  const setTimeFunct = (startTime, endTime) => {
    setStartTime(startTime);
    setEndTime(endTime);
  };

  return (
    <div className="timeline-hub-clickable">
      <div className="timeline-hub-clickable__container">
        <div className="timeline-clickable__line">
          {calculateTimeCenter(endTime, startTime).map((el, id, array) => (
            <Fragment key={id}>
              <span>{el.split(':').slice(0, 2).join(':')}</span>
              {array.length - 1 !== id && (
                <span
                  className="timeline-clickable__timezone"
                  onClick={() => setTimeFunct(el, array[id + 1])}
                >
                  Click to zoom
                </span>
              )}
            </Fragment>
          ))}
        </div>
        {algorithm.map((algorithm, id) => {
          return (
            <div className="timeline-hub-clickable__camera" key={id}>
              <Timeline
                data={data.filter((cam) => cam.algorithm.name === algorithm)}
                startDate={startDate}
                endDate={endDate}
                algorithm={algorithm}
                startTime={startTime}
                endTime={endTime}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

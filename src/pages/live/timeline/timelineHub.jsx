import { Timeline } from './timeline';
import { calculateTimeCenter } from '../../../functions/calculateTimeCenter';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import moment from 'moment';
export const TimelineHub = ({ data, startDate, endDate, startTime, endTime }) => {
  const algorithm = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.algorithm.name])];
  }, []);
  const [newData, setNewData] = useState(data);
  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);

  const setTimeFunct = (startTime, endTime) => {
    setStart(startTime);
    setEnd(endTime);
  };

  useEffect(() => {
    setNewData(data);
  }, [data]);
  return (
    <div className='timeline-hub-clickable'>
      <div className='timeline-hub-clickable__container'>
        <div className='timeline-clickable__line'>
          <span
            className='timeline-clickable__zoomout'
            onClick={() => setTimeFunct('00:00:00', '24:00:00')}
          >
            <AiOutlineZoomOut />
          </span>
          {calculateTimeCenter(start, end).map((el, id, array) => (
            <Fragment key={id}>
              <span>{el.split(':').slice(0, 2).join(':')}</span>
              {array.length - 1 !== id && (
                <span
                  className='timeline-clickable__timezone'
                  onClick={() => setTimeFunct(el, array[id + 1])}
                >
                  <AiOutlineZoomIn />
                </span>
              )}
            </Fragment>
          ))}
        </div>
        {algorithm.length > 0 &&
          start &&
          end &&
          algorithm.map((algorithm, id) => {
            return (
              <div className='timeline-hub-clickable__camera' key={id}>
                <Timeline
                  data={newData.filter(
                    (cam) =>
                      cam.algorithm.name === algorithm &&
                      new Date(`${startDate + ' ' + start}`) <
                        new Date(moment.utc(cam.stop_tracking).utcOffset(moment().utcOffset())) &&
                      new Date(`${startDate + ' ' + end}`) >
                        new Date(moment.utc(cam.start_tracking).utcOffset(moment().utcOffset()))
                  )}
                  startDate={startDate}
                  endDate={endDate}
                  algorithm={algorithm}
                  startTime={start}
                  endTime={end}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

import { calculateTimeCenter } from '../../../../functions/calculateTimeCenter';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { Timeline } from './timeline';
import moment from 'moment';
export const NewTimeline = ({ data, startDate, startTime, endTime, camera }) => {
  const [algorithm, setAlgorithm] = useState([]);

  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);

  const setTimeFunct = (startTime, endTime) => {
    setStart(startTime);
    setEnd(endTime);
  };
  useEffect(() => {
    if (data.length > 0) {
      setAlgorithm(
        data.reduce((prev, curr) => {
          return [...new Set([...prev, curr.algorithm.name])];
        }, [])
      );
    }
  }, [data, start, end]);

  return (
    <>
      {data.length > 0 && start && end && startDate && (
        <div className="timeline-hubNew__container">
          <h1>{camera.name}</h1>
          <div className="timeline-hubclickableNew-">
            <div className="timeline-hub-clickableNew__container">
              {algorithm.map((algorithm, id) => {
                return (
                  <div className="timeline-hub-clickableNew__camera" key={id}>
                    <Timeline
                      data={data.filter(
                        (cam) =>
                          cam.algorithm.name === algorithm &&
                          new Date(`${startDate + ' ' + start}`) <
                            new Date(
                              moment.utc(cam.stop_tracking).utcOffset(moment().utcOffset())
                            ) &&
                          new Date(`${startDate + ' ' + end}`) >
                            new Date(moment.utc(cam.start_tracking).utcOffset(moment().utcOffset()))
                      )}
                      startDate={startDate}
                      algorithm={algorithm}
                      startTime={start}
                      endTime={end}
                    />
                  </div>
                );
              })}
              <div className="timeline-clickableNew__line">
                <span
                  className="timeline-clickableNew__zoomout"
                  onClick={() => setTimeFunct('00:00:00', '24:00:00')}
                >
                  <AiOutlineZoomOut />
                </span>
                {calculateTimeCenter(start, end).map((el, id, array) => (
                  <Fragment key={id}>
                    <span>{el.split(':').slice(0, 2).join(':')}</span>
                    {array.length - 1 !== id && (
                      <span
                        className="timeline-clickableNew__timezone"
                        onClick={() => setTimeFunct(el, array[id + 1])}
                      >
                        <AiOutlineZoomIn />
                      </span>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

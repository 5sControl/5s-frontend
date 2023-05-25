import { Fragment, useEffect, useState } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import moment from 'moment';

import { Timeline } from './timeline';
import { calculateTimeCenter } from '../../../../functions/calculateTimeCenter';

import styles from './timeline.module.scss';
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
        <div className={styles.container}>
          <h1>{camera.name}</h1>
          <div>
            <div className={styles.camera}>
              {algorithm.map((algorithm, id) => {
                return (
                  <div className={styles.algorithm} key={id}>
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
              <div className={styles.timeline__line}>
                <span
                  className={styles.timeline__zoomout}
                  onClick={() => setTimeFunct('00:00:00', '24:00:00')}
                >
                  <AiOutlineZoomOut />
                </span>
                {calculateTimeCenter(start, end).map((el, id, array) => (
                  <Fragment key={id}>
                    <span className={styles.timeline__time}>
                      {el.split(':').slice(0, 2).join(':')}
                    </span>
                    {array.length - 1 !== id && (
                      <span
                        className={styles.timeline__timezone}
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

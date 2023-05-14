import { calculateTimeCenter } from '../../../../functions/calculateTimeCenter';
import { Fragment, useEffect, useState } from 'react';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { getData } from '../../../../api/reportsRequest';
import { useCookies } from 'react-cookie';
import { Timeline } from './timeline';
export const NewTimeline = ({
  startDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  camera,
}) => {
  const [cookies] = useCookies(['token']);
  const [data, setData] = useState([]);
  const [algorithm, setAlgorithm] = useState([]);

  const [start, setStart] = useState(startTime);
  const [end, setEnd] = useState(endTime);

  const setTimeFunct = (startTime, endTime) => {
    setStartTime(startTime);
    setEndTime(endTime);
  };

  useEffect(() => {
    if (data.length > 0) {
      setAlgorithm(
        data.reduce((prev, curr) => {
          return [...new Set([...prev, curr.algorithm.name])];
        }, [])
      );
    }
  }, [data]);

  useEffect(() => {
    getData(
      window.location.hostname,
      cookies.token,
      startDate,
      start
        .split(':')
        .map((el, ind) => (ind === 0 && el >= 3 ? el - 3 : el))
        .join(':'),
      end
        .split(':')
        .map((el, ind) => (ind === 0 && el >= 3 ? el - 3 : el))
        .join(':'),
      'algorithm',
      camera
    ).then((res) => {
      setData(res.data);
    });
  }, [startDate]);

  return (
    <div className="timeline-hub-clickable">
      <div className="timeline-hub-clickable__container">
        {algorithm.map((algorithm, id) => {
          return (
            <div className="timeline-hub-clickable__camera" key={id}>
              <Timeline
                data={data.filter((cam) => cam.algorithm.name === algorithm)}
                startDate={startDate}
                algorithm={algorithm}
                startTime={start}
                endTime={end}
              />
            </div>
          );
        })}
        <div className="timeline-clickable__line">
          <span
            className="timeline-clickable__zoomout"
            onClick={() => setTimeFunct('00:00:00', '24:00:00')}
          >
            <AiOutlineZoomOut />
          </span>
          {calculateTimeCenter(startTime, endTime).map((el, id, array) => (
            <Fragment key={id}>
              <span>{el.split(':').slice(0, 2).join(':')}</span>
              {array.length - 1 !== id && (
                <span
                  className="timeline-clickable__timezone"
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
  );
};

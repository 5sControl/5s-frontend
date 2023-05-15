import { useEffect, useState } from 'react';
import { calculateTime } from '../../../../functions/calculateTimeDuration';
import moment from 'moment';
import { useAppDispatch } from '../../../../store/hooks';
import { addCurrentReport } from '../../../../store/dataSlice';

import './timeline.scss';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';

export const Timeline = ({ data, startDate, algorithm, startTime, endTime }) => {
  const seconds = calculateTime(startTime, endTime);
  const [timeLine, setTimeLine] = useState([]);
  const dispatch = useAppDispatch();

  console.log(data);

  useEffect(() => {
    if (data && data.length > 0) {
      data = data.reverse().map((dat) => {
        return {
          id: dat.id,
          start: moment(dat.start_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment(dat.start_tracking).format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format('YYYY-MM-DD 00:00:00'),
          stop: moment(dat.stop_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment(dat.stop_tracking).format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format('YYYY-MM-DD 24:00:00'),
          violation_found: dat.violation_found ? 'red' : 'green',
        };
      });

      data.unshift({
        id: 0,
        start: moment(startDate).format('YYYY-MM-DD 00:00:00'),
        stop: moment(startDate).format('YYYY-MM-DD 00:00:00'),
        violation_found: 'grey',
      });

      if (moment(startDate).isSame(moment(new Date()), 'day')) {
        data.push({
          id: 0,
          start: moment().format('YYYY-MM-DD HH:mm:ss'),
          stop: moment().format('YYYY-MM-DD HH:mm:ss'),
          violation_found: 'yellow',
        });
      } else {
        data.push({
          id: 0,
          start: moment(startDate).format('YYYY-MM-DD 24:00:00'),
          stop: moment(startDate).format('YYYY-MM-DD 24:00:00'),
          violation_found: 'yellow',
        });
      }

      console.log(data);
    }
  }, [data]);

  console.log(timeLine);
  return (
    <>
      {timeLine.length > 1 && (
        <section className="report-page_timeline">
          <div className="timeline-clickable">
            <span className="timeline-clickable__text"> {parsingAlgorithmName(algorithm)}</span>
            <div className="timeline-clickable__container"></div>
          </div>
        </section>
      )}
    </>
  );
};

import { useEffect, useState } from 'react';
import { calculateTime } from '../../../functions/calculateTimeDuration';
import moment from 'moment';
import { useAppDispatch } from '../../../store/hooks';
import { addCurrentReport } from '../../../store/dataSlice';

import './timeline.scss';
import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';

export const Timeline = ({ data, startDate, algorithm, startTime, endTime }) => {
  const seconds = calculateTime(startTime, endTime);
  const [timeLine, setTimeLine] = useState([]);
  const dispatch = useAppDispatch();

  console.log(moment().format(`YYYY-MM-DD ${endTime}`) > moment().format('YYYY-MM-DD HH:mm:ss'));
  const time = () => {
    return moment().format(`YYYY-MM-DD ${endTime}`) > moment().format('YYYY-MM-DD HH:mm:ss')
      ? moment().format('YYYY-MM-DD HH:mm:ss')
      : moment().format(`YYYY-MM-DD ${endTime}`);
  };
  useEffect(() => {
    if (data) {
      console.log();
      let buf = [{ id: 0, time: time(), violation_found: false }];
      data.forEach((el) => {
        buf.push({
          id: el.id,
          time: moment(new Date(el.stop_tracking)).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          violation_found: el.violation_found,
        });
        buf.push({
          id: el.id,
          time: moment(new Date(el.start_tracking)).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
          violation_found: el.violation_found,
        });
      });
      buf.push({
        id: 0,
        time: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        violation_found: false,
      });
      buf.reverse();
      //  buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
      buf = buf.map((el, index, array) =>
        index < array.length - 1
          ? {
              id: el.id,
              time: moment(array[index + 1].time).diff(moment(el.time), 'seconds'),
              violation_found: el.violation_found,
            }
          : 0
      );
      buf.pop();
      console.log(buf);
      setTimeLine(buf);
    }
  }, [data]);

  return (
    <>
      {timeLine.length > 1 && (
        <section className="report-page_timeline">
          <div className="timeline-clickable">
            <span className="timeline-clickable__text"> {parsingAlgorithmName(algorithm)}</span>
            <div className="timeline-clickable__container">
              {timeLine.map((el, ind) => (
                <span
                  key={ind}
                  style={el.time > 0 ? { width: `${(el.time / seconds) * 100}%` } : {}}
                  className={
                    ind % 2 && el.violation_found
                      ? 'timeline-clickable_red timeline-clickable_pointer'
                      : ' timeline-clickable_green'
                  }
                  title={`${el.violation_found}`}
                  onClick={() =>
                    el.id !== 0
                      ? dispatch(addCurrentReport(data.filter((item) => item.id === el.id)[0]))
                      : undefined
                  }
                ></span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

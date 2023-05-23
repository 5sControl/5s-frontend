import { useEffect, useState } from 'react';
import moment from 'moment';

import { calculateTime } from '../../../../functions/calculateTimeDuration';
import ImageSlider from '../../../../components/slider/slider';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import {
  CrossWhite,
  ViolintationFalse,
  ViolintationTrue,
} from '../../../../assets/svg/SVGcomponent.ts';
import './timeline.scss';

export const Timeline = ({ data, startDate, algorithm, startTime, endTime }) => {
  const [timeLine, setTimeLine] = useState([]);
  const [currentReport, setCurrentReport] = useState(false);

  const [currentCount, setCurrentCount] = useState(0);

  const duration = (start, end) => {
    return (moment(end).diff(moment(start), 'seconds') / calculateTime(startTime, endTime)) * 100;
  };

  useEffect(() => {
    setCurrentCount(0);
  }, [currentReport]);

  const timeDuration = (start, end) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${days ? days + 'days' : ''} ${hours ? hours + 'hours' : ''} ${
      minutes ? minutes + 'min' : ''
    } ${seconds ? seconds + 'sec' : ''}`;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      let bufdata = data.reverse().map((dat) => {
        return {
          id: dat.id,
          start: moment(dat.start_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment
                .utc(dat.start_tracking)
                .utcOffset(moment().utcOffset())
                .format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(dat.stop_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment
                .utc(dat.stop_tracking)
                .utcOffset(moment().utcOffset())
                .format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: dat.violation_found ? 'red' : 'green',
        };
      });

      bufdata.unshift({
        id: 0,
        start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        violation_found: 'grey',
      });

      if (moment(startDate).isSame(moment(new Date()), 'day')) {
        if (new Date(`${startDate + ' ' + endTime}`) > new Date()) {
          bufdata.push({
            id: 0,
            start: moment().format('YYYY-MM-DD HH:mm:ss'),
            stop: moment().format('YYYY-MM-DD HH:mm:ss'),
            violation_found: 'yellow',
          });
        } else {
          bufdata.push({
            id: 0,
            start: moment().format(`YYYY-MM-DD ${endTime}`),
            stop: moment().format(`YYYY-MM-DD ${endTime}`),
            violation_found: 'yellow',
          });
        }
      } else {
        bufdata.push({
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        });
      }
      setTimeLine(bufdata);
    } else {
      setTimeLine([
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          violation_found: 'grey',
        },
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        },
      ]);
    }
  }, [data]);

  return (
    <>
      {timeLine.length > 1 && (
        <section className="report-page_timeline">
          <div className="timeline-clickableNew">
            <span className="timeline-clickableNew__text"> {parsingAlgorithmName(algorithm)}</span>
            <div className="timeline-clickableNew__container">
              {timeLine.map((el, index, array) => (
                <span
                  key={index}
                  onClick={() =>
                    el.id !== 0
                      ? setCurrentReport(data.filter((item) => item.id === el.id)[0])
                      : undefined
                  }
                  className={`timeline-clickableNew_${el.violation_found} timeline-clickableNew_pointer`}
                  style={{
                    width: `${el.violation_found !== 'yellow' ? duration(el.start, el.stop) : 0}%`,
                    marginLeft: `${
                      index === 0 ? '0px' : duration(array[index - 1].stop, el.start)
                    }%`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        </section>
      )}
      {currentReport && (
        <section className="fullTimeline">
          <div className="fullTimeline__container">
            <div className="fullTimeline__image">
              <ImageSlider
                images={currentReport.photos}
                currentCount={currentCount}
                setCurrentCount={(e) => setCurrentCount(e)}
              />
            </div>
            <footer className="fullTimeline__footer">
              <div className="fullTimeline__footer_up">
                <span className="fullTimeline__footer_time">
                  {moment
                    .utc(currentReport.start_tracking)
                    .utcOffset(moment().utcOffset())
                    .format('YYYY-MM-DD ')}
                  |
                  {moment
                    .utc(currentReport.start_tracking)
                    .utcOffset(moment().utcOffset())
                    .format(' HH:mm:ss')}
                  -
                  {moment
                    .utc(currentReport.stop_tracking)
                    .utcOffset(moment().utcOffset())
                    .format('HH:mm:ss')}
                </span>
                {currentReport.violation_found ? <ViolintationFalse /> : <ViolintationTrue />}
              </div>
              <div className="fullTimeline__footer_text">
                <span>
                  Duration:&nbsp;
                  {timeDuration(currentReport.start_tracking, currentReport.stop_tracking)}
                </span>
              </div>
              <div className="fullTimeline__footer_text">
                <span>Camera:&nbsp;</span>
                {currentReport.camera ? currentReport.camera.name : 'Deleted Camera'}
              </div>
              <div className="fullTimeline__footer_text">
                <span>Algorithm:&nbsp;</span>
                {parsingAlgorithmName(currentReport.algorithm.name)}
              </div>
            </footer>
            <div className="fullTimeline__close" onClick={() => setCurrentReport(false)}>
              <CrossWhite />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

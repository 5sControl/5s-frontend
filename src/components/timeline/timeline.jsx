/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { calculateTime } from "../../functions/calculateTimeDuration";
import moment from "moment";
import "./timeline.scss";

export const Timeline = ({
  data,
  startDate,
  endDate,
  algorithm,
  startTime,
  endTime,
  setCurrentReportMain,
}) => {
  const seconds = calculateTime(startTime, endTime);
  const [timeLine, setTimeLine] = useState([]);
  
  useEffect(() => {
    if (data) {
      let buf = [
        { id: 0, time: moment(startDate).format(`YYYY-MM-DD ${endTime}`) },
      ];
      data.forEach((el) => {
        buf.push({
          id: el.id,
          time: moment(new Date(el.stop_tracking))
            .add(3, "hours")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
        buf.push({
          id: el.id,
          time: moment(new Date(el.start_tracking))
            .add(3, "hours")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      });
      buf.push({ id: 0, time: moment(startDate).format(`YYYY-MM-DD ${startTime}`) });
      buf.reverse();
      //  buf = buf.filter(el => el.includes(moment().format("YYYY-MM-DD")))
      buf = buf.map((el, index, array) =>
        index < array.length - 1
          ? {
              id: el.id,
              time: moment(array[index + 1].time).diff(
                moment(el.time),
                "seconds"
              ),
            }
          : 0
      );
      buf.pop();
      
      setTimeLine(buf);
    }
  }, [data]);

  return (
    <>
      {timeLine.length > 1 && (
        <section className="report-page_timeline">
          <div className="timeline">
            <span className="timeline__text"> {algorithm}</span>
            <div className="timeline__container">
              {timeLine.map((el, ind) => (
                <span
                  key={ind}
                  style={el.time > 0 ?{ width: `${(el.time / seconds) * 100}%` } : {}}
                  className={ind % 2 ? "timeline_red" : " timeline_green"}
                  title={`Duration: ${el.time} seconds`}
                  onClick={() =>
                    el.id !== 0 ? setCurrentReportMain(el.id) : undefined
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

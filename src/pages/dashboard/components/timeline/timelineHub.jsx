import { Timeline } from './timeline';
import { calculateTimeCenter } from '../../../../functions/calculateTimeCenter';
import { NewTimeline } from './newTimeline';
export const TimelineHub = ({ data, startDate, endDate, startTime, endTime }) => {
  const algorithm = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.algorithm.name])];
  }, []);

  const cameras = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.camera.id])];
  }, []);

  return (
    <div className="timeline-hub">
      {cameras.map((el, id) => {
        return (
          <div key={id} className="timeline-hub__container">
            <h1>{el}</h1>
            <NewTimeline
              startDate={startDate}
              startTime={startTime}
              endTime={endTime}
              camera={el}
            />
            {/* <TimelineNew
              data={reports}
              startDate={selectDate}
              endDate={selectDate}
              startTime={startTime}
              endTime={endTime}
              setStartTime={(e) => setStartTime(e)}
              setEndTime={(e) => setEndTime(e)}
            /> */}
          </div>
        );
      })}
    </div>
  );
};

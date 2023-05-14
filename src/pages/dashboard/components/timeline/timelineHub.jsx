import { NewTimeline } from './newTimeline';
export const TimelineHub = ({ data, startDate, startTime, endTime }) => {
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
          </div>
        );
      })}
    </div>
  );
};

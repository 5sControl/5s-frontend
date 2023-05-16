import { NewTimeline } from './newTimeline';

export const TimelineHub = ({ data, startDate, startTime, endTime, cameras }) => {
  return (
    <div className="timeline-hubNew">
      {cameras &&
        cameras.length > 0 &&
        cameras.map((el, id) => {
          return (
            <NewTimeline
              data={data.filter((dat) => dat.camera.id === el.id)}
              startDate={startDate}
              startTime={startTime}
              endTime={endTime}
              camera={el}
              key={id}
            />
          );
        })}
    </div>
  );
};

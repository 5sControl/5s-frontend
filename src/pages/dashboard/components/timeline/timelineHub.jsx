import { Timeline } from './timeline';
import { calculateTimeCenter } from '../../../../functions/calculateTimeCenter';

export const TimelineHub = ({ data, startDate, endDate, startTime, endTime }) => {
  const algorithm = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.algorithm.name])];
  }, []);

  const cameras = data.reduce((prev, curr) => {
    return [...new Set([...prev, curr.camera.name])];
  }, []);

  return (
    <div className="timeline-hub">
      {cameras.map((el, id) => {
        return (
          <div key={id} className="timeline-hub__container">
            <h1>{el}</h1>
            {algorithm.map((algorithm, id) => {
              return (
                <div className="timeline-hub__camera" key={id}>
                  <Timeline
                    data={data
                      .filter((e) => e.camera.name === el)
                      .filter((cam) => cam.algorithm.name === algorithm)}
                    startDate={startDate}
                    endDate={endDate}
                    algorithm={algorithm}
                    startTime={startTime}
                    endTime={endTime}
                  />
                </div>
              );
            })}
            <div className="timeline__line">
              <span>{startTime.split(':').slice(0, 2).join(':')}</span>
              {calculateTimeCenter(endTime, startTime).map((el, id) => (
                <span key={id}>{el.split(':').slice(0, 2).join(':')}</span>
              ))}
              <span>{endTime.split(':').slice(0, 2).join(':')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

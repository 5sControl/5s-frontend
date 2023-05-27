import { NewTimeline } from './newTimeline';

import styles from './timeline.module.scss';

export const TimelineHub = ({ data, startDate, startTime, endTime, cameras }) => {
  return (
    <div className={styles.wrapper}>
      {cameras &&
        cameras.length > 0 &&
        cameras.map((el, id) => {
          return (
            <NewTimeline
              data={data.filter((dat) => dat.camera && dat.camera.id === el.id)}
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

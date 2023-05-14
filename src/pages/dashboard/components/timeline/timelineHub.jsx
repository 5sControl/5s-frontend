import { useEffect, useState } from 'react';
import { NewTimeline } from './newTimeline';
import { getSelectedCameras } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
export const TimelineHub = ({ startDate, startTime, endTime }) => {
  const [cookies] = useCookies(['token']);
  const [cameras, setCameras] = useState([]);
  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token).then((res) => {
      setCameras(res.data);
    });
  }, []);

  return (
    <div className="timeline-hub">
      {cameras.map((el, id) => {
        return (
          <NewTimeline
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

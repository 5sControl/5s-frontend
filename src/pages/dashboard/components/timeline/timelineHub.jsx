import { useEffect, useState } from 'react';
import { NewTimeline } from './newTimeline';
import { getSelectedCameras } from '../../../../api/cameraRequest';
import { useCookies } from 'react-cookie';
export const TimelineHub = ({ data, startDate, startTime, endTime }) => {
  const [cookies] = useCookies(['token']);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token).then((res) => {
      setCameras(res.data);
    });
  }, []);

  return (
    <div className="timeline-hubNew">
      {cameras.map((el, id) => {
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

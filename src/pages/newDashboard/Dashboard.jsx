import { useEffect, useState } from 'react';
import { getLogs } from '../../api/algorithmRequest';
import { useCookies } from 'react-cookie';

import './live.scss';
import { getSelectedCameras } from '../../api/cameraRequest';
export const Dashboard = () => {
  const location = window.location.hostname;
  const [cookies] = useCookies(['token']);
  const [cameras, setCameras] = useState([]);
  useEffect(() => {
    getLogs(location, cookies.token).then((res) => {
      console.log(res);
    });

    getSelectedCameras(location, cookies.token).then((res) => {
      setCameras(res.data ? res.data : []);
    });
  }, []);

  return (
    <section className="live">
      <div className="live__title">
        <h1>Live</h1>
        <span>Calendar</span>
      </div>
      <div className="live__container">
        <div className="live__reports">
          <div className="live__camera">
            {cameras.map((camera, index) => {
              return <span key={index}>{camera.name}</span>;
            })}
          </div>
          <div className="live__report-info"></div>
        </div>
        <div className="live__timeline"></div>
      </div>
    </section>
  );
};

import { useEffect, useState } from 'react';
import moment from 'moment';
import { getLogs } from '../../api/algorithmRequest';
import { getData } from '../../api/reportsRequest';
import { useCookies } from 'react-cookie';
import { DataPicker } from '../dashboard/components/dataPicker';
import './live.scss';
import { getSelectedCameras } from '../../api/cameraRequest';

export const Dashboard = () => {
  const location = window.location.hostname;
  const [cookies] = useCookies(['token']);
  const [cameras, setCameras] = useState([]);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [cameraToResponse, setCameraToResponse] = useState('camera');

  const update = () => {
    getData(
      location,
      cookies.token,
      selectDate,
      '00:00:00',
      '23:59:59'
        .split(':')
        .map((el, ind) => (ind === 0 ? el - 1 : el))
        .join(':'),
      'algorithm',
      cameraToResponse
    ).then((el) => {
      console.log(el);
    });
  };

  useEffect(() => {
    getLogs(location, cookies.token).then((res) => {
      console.log(res, 'logs');
    });

    getSelectedCameras(location, cookies.token).then((res) => {
      setCameras(res.data ? res.data : []);
    });
  }, []);

  useEffect(() => {
    update();
  }, [visibleModalDate, cameraToResponse]);

  return (
    <>
      <section className="live">
        <div className="live__title">
          <h1>Live</h1>
          <button
            onClick={() => setVisibleModalDate(!visibleModalDate)}
            className="live__data-button"
          >
            {`${selectDate}`}
          </button>
        </div>
        <div className="live__container">
          <div className="live__reports">
            <div className="live__camera">
              <h2>Cameras</h2>
              <input type="text" placeholder="Search" className="live__camera_filter" />
              <div className="live__camera_container">
                {cameras.map((camera, index) => {
                  return (
                    <span
                      key={index}
                      className={
                        cameraToResponse === camera.id
                          ? 'live__active live__camera_item '
                          : 'live__camera_item'
                      }
                      onClick={() => setCameraToResponse(camera.id)}
                    >
                      {camera.name}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="live__report-info"></div>
          </div>
          <div className="live__timeline"></div>
        </div>
      </section>
      {visibleModalDate && (
        <DataPicker
          setSelectDate={(e) => setSelectDate(e)}
          update={update}
          setVisibleModalDate={(e) => setVisibleModalDate(e)}
          selectDateDash={selectDate}
        />
      )}
    </>
  );
};

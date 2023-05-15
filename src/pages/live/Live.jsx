import { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { getData } from '../../api/reportsRequest';
import { useCookies } from 'react-cookie';
import { DataPicker } from '../dashboard/components/dataPicker';
import './live.scss';
import { getSelectedCameras } from '../../api/cameraRequest';
import { TimelineHub } from './timeline/timelineHub';
import { CurrentReport } from './currentReport/currentReport';
import { useAppDispatch } from '../../store/hooks';
import { addCurrentReport } from '../../store/dataSlice';

export const Live = () => {
  const location = window.location.hostname;
  const [cookies] = useCookies(['token']);
  const [cameras, setCameras] = useState([]);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [cameraToResponse, setCameraToResponse] = useState('camera');
  const [reports, setReports] = useState([]);
  const [inputFilter, setInputFilter] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('24:00:00');
  const dispatch = useAppDispatch();

  const update = () => {
    if (cameraToResponse !== 'camera') {
      getData(
        location,
        cookies.token,
        selectDate,
        startTime
          .split(':')
          .map((el, ind) => (ind === 0 && el >= 3 ? el - 3 : el))
          .join(':'),
        endTime
          .split(':')
          .map((el, ind) => (ind === 0 && el >= 3 ? el - 3 : el))
          .join(':'),
        'algorithm',
        cameraToResponse
      ).then((el) => {
        // console.log(el.data);
        setReports(el.data);
      });
    }
  };

  useEffect(() => {
    getSelectedCameras(location, cookies.token).then((res) => {
      setCameras(res.data ? res.data : []);
    });
  }, []);

  useEffect(() => {
    if (cameraToResponse !== 'camera' && !visibleModalDate) {
      update();
    }
  }, [endTime, startTime]);

  useEffect(() => {
    setStartTime('00:00:00');
    setEndTime('24:00:00');
    dispatch(addCurrentReport(false));
    if (endTime === '24:00:00') {
      update();
    }
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
              <input
                type="text"
                placeholder="Search"
                className="live__camera_filter"
                value={inputFilter}
                onChange={(e) => setInputFilter(e.target.value)}
              />
              <div className="live__camera_container">
                {cameras.map((camera, index) => {
                  return (
                    <Fragment key={index}>
                      {camera.name.toLowerCase().includes(inputFilter.toLowerCase()) && (
                        <span
                          className={
                            cameraToResponse === camera.id
                              ? 'live__active live__camera_item '
                              : 'live__camera_item'
                          }
                          onClick={() => setCameraToResponse(camera.id)}
                        >
                          {camera.name}
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            <div className="live__report-info">
              <div className="live__report-info_list">
                {/* {reports.map((report, index) => (
                  <div
                    key={index}
                    className="live__report-info_list_item"
                    onClick={() => console.log(report)}
                  >
                    <p>{report.id}</p>
                    <p>{parsingAlgorithmName(report.algorithm.name)}</p>
                  </div>
                ))} */}
              </div>
              <CurrentReport camera={cameraToResponse} />
            </div>
          </div>
          {console.log(reports)}
          <div className="live__timeline">
            {reports.length > 0 && cameraToResponse !== 'camera' ? (
              <TimelineHub
                data={reports}
                startDate={selectDate}
                endDate={selectDate}
                startTime={startTime}
                endTime={endTime}
                setStartTime={(e) => setStartTime(e)}
                setEndTime={(e) => setEndTime(e)}
              />
            ) : (
              <div>No Data</div>
            )}
          </div>
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

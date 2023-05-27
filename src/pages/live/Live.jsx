import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import moment from 'moment';

import { getData } from '../../api/reportsRequest';
import { DayPicker } from '../../components/dayPicker/dayPicker';
import { getSelectedCameras } from '../../api/cameraRequest';
import { TimelineHub } from './timeline/timelineHub';
import { CurrentReport } from './currentReport/currentReport';
import { useAppDispatch } from '../../store/hooks';
import { addCurrentReport } from '../../store/dataSlice';

import { ArrowBottom, SearchIcon } from '../../assets/svg/SVGcomponent';

import './live.scss';

export const Live = () => {
  const navigate = useNavigate();
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

  const timeDef = moment().utcOffset() / 60;

  const update = () => {
    if (cameraToResponse !== 'camera') {
      getData(
        location,
        cookies.token,
        selectDate,
        startTime
          .split(':')
          .map((el, ind) => (ind === 0 && el >= timeDef ? el - timeDef : el))
          .join(':'),
        endTime
          .split(':')
          .map((el, ind) => (ind === 0 && el >= timeDef ? el - timeDef : el))
          .join(':'),
        'algorithm',
        cameraToResponse
      )
        .then((el) => {
          setReports(el.data);
        })
        .catch((error) => {
          if (error.response.status === 403) {
            navigate('/company');
          }
        });
    }
  };

  useEffect(() => {
    getSelectedCameras(location, cookies.token)
      .then((res) => {
        setCameras(res.data ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
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

  const handleSelect = (ranges) => {
    setSelectDate(moment(ranges.selection.startDate).format('YYYY-MM-DD'));
    setVisibleModalDate(false);
  };

  return (
    <>
      <section className="live">
        <div className="live__title">
          <h1>Live</h1>
          <button
            onClick={() => setVisibleModalDate(!visibleModalDate)}
            className="live__data-button"
          >
            {new Date(selectDate ? selectDate : new Date().toDateString()).toDateString() ===
            new Date().toDateString()
              ? 'Today, ' + (selectDate ? moment(selectDate).format('ll') : moment().format('ll'))
              : moment(selectDate).format('ll')
              ? moment(selectDate).format('ll')
              : moment().format('ll')}
            <ArrowBottom style={{ marginLeft: '10px', width: '9px' }} />
          </button>
        </div>
        <div className="live__container">
          <div className="live__reports">
            <div className="live__camera">
              <h2>Cameras</h2>
              <div className="live__camera_filter">
                <input
                  type="text"
                  placeholder="Search"
                  value={inputFilter}
                  onChange={(e) => setInputFilter(e.target.value)}
                />
                <SearchIcon />
              </div>
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
              <div className="live__report-info_list"></div>
              <CurrentReport camera={cameraToResponse} />
            </div>
          </div>
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
        <DayPicker
          selectDate={selectDate}
          handleSelect={handleSelect}
          onClose={() => setVisibleModalDate(false)}
        />
      )}
    </>
  );
};

import './Dashboard.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { Reports } from './components/reports/Reports';
import { getData } from '../../api/reportsRequest';
import { TimelineHub } from './components/timeline/timelineHub';
import { Preloader } from '../../components/preloader';
import { FilterForm } from './components/filter';
import { getLogs } from '../../api/algorithmRequest';

function Dashboard() {
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('24:00:00');
  const [cookies] = useCookies(['token']);

  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectCameras, setSelectCameras] = useState([]);

  const [cameraToResponse, setCameraToResponse] = useState('camera');
  const [algorithmToResponse, setAlgorithmToResponse] = useState('algorithm');

  const update = () => {
    getData(
      window.location.hostname,
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
    )
      .then((el) => {
        let onlyCamera = el.data.map((el) => el.camera);
        let res = [
          ...new Set(
            onlyCamera.map((item) =>
              JSON.stringify(
                Object.keys(item)
                  .sort()
                  .reduce((obj, value) => ((obj[value] = item[value]), obj), {})
              )
            )
          ),
        ].map((item) => JSON.parse(item));
        setSelectCameras(res);

        el.data.detail === 'Authentication credentials were not provided.' ||
        el.data.detail === 'Given token not valid for any token type'
          ? setData(0)
          : el.data.length !== data.length
          ? setData(el.data)
          : setData(data);
      })
      .catch((error) => setErrorCatch(error.message));
  };

  useEffect(() => {
    update();
    getLogs(window.location.hostname, cookies.token).then((res) => {
      // console.log(res);
    });
  }, [selectDate, cameraToResponse, algorithmToResponse]);

  return (
    <>
      <div className="dashboard">
        <FilterForm
          cookies={cookies}
          setCameraToResponse={(e) => setCameraToResponse(e)}
          cameraToResponse={cameraToResponse}
          algorithmToResponse={algorithmToResponse}
          setAlgorithmToResponse={(e) => setAlgorithmToResponse(e)}
          update={update}
          endTime={endTime}
          setEndTime={(e) => setEndTime(e)}
          selectDate={selectDate}
          setSelectDate={(e) => setSelectDate(e)}
          setStartTime={(e) => setStartTime(e)}
          startTime={startTime}
          selectCameras={selectCameras}
        />

        {!data ? (
          <Preloader />
        ) : data.length > 0 ? (
          <>
            <TimelineHub
              startDate={moment(selectDate).format('YYYY-MM-DD')}
              startTime={startTime}
              endTime={endTime}
            />
            <h3>
              Reports <span>{data.length}</span>
            </h3>
            <Reports data={data} />
          </>
        ) : (
          <div className="dashboard__noreports">No reports found</div>
        )}
        {errorCatch && <div className="dashboard__error">{errorCatch}</div>}
      </div>
    </>
  );
}

export default Dashboard;

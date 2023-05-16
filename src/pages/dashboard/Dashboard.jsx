import './Dashboard.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { Reports } from './components/reports/Reports';
import { getData } from '../../api/reportsRequest';
import { TimelineHub } from './components/timeline/timelineHub';
import { Preloader } from '../../components/preloader';
import { Header } from './components/header';

function Dashboard() {
  const startTime = '00:00:00';
  const endTime = '24:00:00';
  const [data, setData] = useState(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [cookies] = useCookies(['token']);
  const [isPreloader, setIsPreloader] = useState(false);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));

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
      'camera'
    )
      .then((el) => {
        el.data.detail === 'Authentication credentials were not provided.' ||
        el.data.detail === 'Given token not valid for any token type'
          ? setData(0)
          : el.data.length !== data.length
          ? setData(el.data)
          : setData(el.data);
        setIsPreloader(false);
      })
      .catch((error) => {
        setIsPreloader(false);
        setErrorCatch(error.message);
      });
  };

  useEffect(() => {
    update();
    setIsPreloader(true);
  }, [selectDate]);

  return (
    <>
      <div className="dashboard">
        <Header selectDate={selectDate} setSelectDate={(e) => setSelectDate(e)} />
        {!data || isPreloader ? (
          <Preloader />
        ) : data.length > 0 ? (
          <>
            <TimelineHub
              startDate={moment(selectDate).format('YYYY-MM-DD')}
              startTime={startTime}
              endTime={endTime}
              data={data}
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

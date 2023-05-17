/* eslint-disable @typescript-eslint/no-explicit-any */
import './Dashboard.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';
import { getSelectedCameras } from '../../api/cameraRequest';
import { Reports } from './components/reports/Reports';
import { getData } from '../../api/reportsRequest';
import { TimelineHub } from './components/timeline/timelineHub';
import { Preloader } from '../../components/preloader';
import { Header } from './components/header';
import { getAveilableAlgorithms } from '../../api/algorithmRequest';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const startTime: any = '00:00:00';
  const endTime: any = '24:00:00';
  const [data, setData] = useState<any>(false);
  const [errorCatch, setErrorCatch] = useState(false);
  const [cookies] = useCookies(['token']);
  const [isPreloader, setIsPreloader] = useState(false);
  const [selectDate, setSelectDate] = useState(moment().format('YYYY-MM-DD'));
  const [cameras, setCameras] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const timeDef = moment().utcOffset() / 60;

  const update = () => {
    setIsPreloader(true);
    const searchParams = new URLSearchParams(window.location.search);
    const algorithmsURL = searchParams.getAll('algorithm');
    const camerasURL = searchParams.getAll('camera');

    getData(
      window.location.hostname,
      cookies.token,
      selectDate,
      startTime
        .split(':')
        .map((el: number, ind: number) => (ind === 0 && el >= timeDef ? el - timeDef : el))
        .join(':'),
      endTime
        .split(':')
        .map((el: number, ind: number) => (ind === 0 && el >= timeDef ? el - timeDef : el))
        .join(':'),
      algorithmsURL.length > 0 ? algorithmsURL : 'algorithm',
      camerasURL.length > 0 ? camerasURL : 'camera'
    )
      .then((el) => {
        el.data.detail === 'Authentication credentials were not provided.' ||
        el.data.detail === 'Given token not valid for any token type'
          ? setData(false)
          : el.data.length !== data.length
          ? setData(el.data)
          : setData(el.data);
        setIsPreloader(false);
      })
      .catch((error) => {
        setIsPreloader(false);
        setErrorCatch(error.message);
        if (error.response.status === 403) {
          navigate('/company');
        }
      });
  };

  useEffect(() => {
    update();
  }, [selectDate]);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token).then((res) => {
      setCameras(res.data);
    });
    getAveilableAlgorithms(window.location.hostname, cookies.token).then((res) => {
      if (res.data.length > 0) {
        setAlgorithms(res.data.filter((alg: any) => alg.is_available));
      }
    });
  }, []);

  return (
    <>
      <div className="dashboard">
        <Header
          selectDate={selectDate}
          setSelectDate={(e: any) => setSelectDate(e)}
          cameras={cameras}
          algorithms={algorithms}
          data={data}
          update={update}
        />
        {!data || isPreloader ? (
          <Preloader />
        ) : data.length > 0 ? (
          <>
            <TimelineHub
              startDate={moment(selectDate).format('YYYY-MM-DD')}
              startTime={startTime}
              endTime={endTime}
              data={data}
              cameras={cameras}
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

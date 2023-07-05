/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { getSelectedCameras } from '../../api/cameraRequest';
import { Reports } from './components/reports/Reports';
import { getData } from '../../api/reportsRequest';
import { TimelineHub } from './components/timeline/timelineHub';
import { Preloader } from '../../components/preloader';
import { Header } from './components/header/header';
import { getAveilableAlgorithms } from '../../api/algorithmRequest';
import { useAppDispatch } from '../../store/hooks';
import { addCurrentReport } from '../../store/dataSlice';
import styles from './dashboard.module.scss';
import { HeaderMain } from '../../components/header';

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
  const [activePage, setActivePage] = useState('timelines');
  const dispatch = useAppDispatch();
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
        console.log(error);
        setIsPreloader(false);
        setErrorCatch(error.message);
        if (error.response.status === 403) {
          navigate('/company');
        }
      });
  };
  useEffect(() => {
    update();
    dispatch(addCurrentReport(false));
  }, [selectDate]);

  useEffect(() => {
    getSelectedCameras(window.location.hostname, cookies.token)
      .then((res) => {
        setCameras(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    getAveilableAlgorithms(window.location.hostname, cookies.token)
      .then((res) => {
        if (res.data.length > 0) {
          setAlgorithms(res.data.filter((alg: any) => alg.is_available));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className={styles.dashboard}>
        <HeaderMain title={'Dashboard'}>
          <section className={styles.tabs}>
            <span
              className={`${styles.tab} ${
                activePage === 'timelines' ? styles.active : styles.noActive
              }`}
              onClick={() => setActivePage('timelines')}
            >
              Timelines
            </span>
            <span
              className={`${styles.tab} ${
                activePage === 'reports' ? styles.active : styles.noActive
              }`}
              onClick={() => setActivePage('reports')}
            >
              Reports
            </span>
          </section>
          <Header
            selectDate={selectDate}
            setSelectDate={(e: any) => setSelectDate(e)}
            cameras={cameras}
            algorithms={algorithms}
            data={data}
            update={update}
          />
        </HeaderMain>

        <main className={styles.wrapper}>
          <section className={styles.content}>
            {!data || isPreloader ? (
              <Preloader />
            ) : data.length > 0 ? (
              <>
                {activePage === 'timelines' && (
                  <TimelineHub
                    startDate={moment(selectDate).format('YYYY-MM-DD')}
                    startTime={startTime}
                    endTime={endTime}
                    data={data}
                    cameras={cameras}
                  />
                )}
                {activePage === 'reports' && <Reports data={data} selectDate={selectDate} />}
              </>
            ) : (
              <div className={styles.noreports}>No reports found</div>
            )}
          </section>
        </main>

        {errorCatch && <div className={styles.error}>{errorCatch}</div>}
      </div>
    </>
  );
}

export default Dashboard;

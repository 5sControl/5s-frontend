import { useEffect } from 'react';
import { getLogs } from '../../api/algorithmRequest';
import { useCookies } from 'react-cookie';

import './live.scss';
export const Dashboard = () => {
  const location = window.location.hostname;
  const [cookies] = useCookies(['token']);
  useEffect(() => {
    getLogs(location, cookies.token).then((res) => {
      console.log(res);
    });
  }, []);
  return (
    <section className="live">
      <div className="live__title">
        <h1>Live</h1>
        <span>Calendar</span>
      </div>
      <div className="live__container">
        <div className="live__cameras"></div>
      </div>
    </section>
  );
};

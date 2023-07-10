import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../store/hooks';
import { getConnectionsToDB } from './connectionSlice';
import { HeaderMain } from '../../components/header';
import { Camera } from '../camera/Camera';
import { DatabaseTab } from './components/DatabaseTab/DatabaseTab';
import { Notifications } from '../notificationEmail/notifications';
import styles from './configuration.module.scss';
import { Link } from 'react-router-dom';

export const Configuration: React.FC<{ activeTab: number }> = ({ activeTab }) => {
  const [cookies] = useCookies(['token']);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getConnectionsToDB({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <HeaderMain title={'Configuration'}>
        <section className={styles.tabs}>
          <Link
            to="/configuration/camera"
            className={`${styles.tab} ${activeTab === 0 ? styles.active : styles.noActive}`}
          >
            <span>Camera</span>
          </Link>
          <Link
            to="/configuration/database"
            className={`${styles.tab} ${activeTab === 1 ? styles.active : styles.noActive}`}
          >
            <span>Database</span>
          </Link>
          <Link
            to="/configuration/notifications"
            className={`${styles.tab} ${activeTab === 2 ? styles.active : styles.noActive}`}
          >
            <span>Notifications</span>
          </Link>
        </section>
        <div className={styles.tabs}>
          <Link
            to="/configuration/camera"
            className={`${styles.tab} ${activeTab === 0 ? styles.active : styles.noActive}`}
          >
            Camera
          </Link>
          <Link
            to="/configuration/database"
            className={`${styles.tab} ${activeTab === 1 ? styles.active : styles.noActive}`}
          >
            Database
          </Link>
          <Link
            to="/configuration/notifications"
            className={`${styles.tab} ${activeTab === 2 ? styles.active : styles.noActive}`}
          >
            Notifications
          </Link>
        </div>
      </HeaderMain>
      {activeTab === 0 && <Camera />}
      {activeTab === 1 && <DatabaseTab />}
      {activeTab === 2 && <Notifications />}
    </>
  );
};

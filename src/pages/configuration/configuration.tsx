import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button } from '../../components/button/button';
import { Camera } from '../../components/camera/Camera';
import { Cover } from '../../components/cover';
import { Tabs, Tab } from '../../components/tabs';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch } from '../../store/hooks';
import { DatabaseTab } from './components/DatabaseTab';
import styles from './configuration.module.scss';
import { getConnectionsToDB } from './connectionSlice';

export const Configuration: React.FC = () => {
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
    <WrapperPage>
      <h2 className={styles.title}>Configuration</h2>

      <Tabs>
        <Tab label="License">
          <Cover className={styles.license}>
            <div>
              <p className={styles.license_title}>License</p>

              <h3 className={styles.license_count}>
                {'0/5'}&nbsp;
                <span className={styles.license_span}>algorithms used</span>
              </h3>
            </div>

            <Button text="Upgrade Plan" />
          </Cover>
        </Tab>

        <Tab label="Databases">
          <DatabaseTab />
        </Tab>

        <Tab label="Cameras">
          <Camera />
        </Tab>
      </Tabs>
    </WrapperPage>
  );
};

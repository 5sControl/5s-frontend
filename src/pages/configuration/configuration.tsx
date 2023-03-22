import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Camera } from '../../components/camera/Camera';
import { Tabs, Tab } from '../../components/tabs';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch } from '../../store/hooks';
import { DatabaseTab } from './components/DatabaseTab';
import { LicenseTab } from './components/LicenseTab';
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
          <LicenseTab />
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

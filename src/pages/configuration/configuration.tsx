import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Tabs, Tab } from '../../components/tabs';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch } from '../../store/hooks';
import { tabsData } from './config';
import styles from './configuration.module.scss';
import { getConnectionsToDB } from './connectionSlice';
import { HeaderMain } from '../../components/header';

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
      <HeaderMain title={'Configuration'}></HeaderMain>
      <Tabs activeTabDefault={activeTab} tabList={tabsData}>
        {tabsData.map((tab) => (
          <Tab key={tab.id} label={tab.title}>
            {tab.component}
          </Tab>
        ))}
      </Tabs>
    </>
  );
};

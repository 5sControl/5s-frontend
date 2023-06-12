import './Company.scss';
import { Tab, Tabs } from '../../components/tabs';
import { tabsData } from './config';
import { FC, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../store/hooks';
import { getCompanies, getCountries } from './companySlice';

export const Company: FC<{ activeTab: number }> = ({ activeTab }) => {
  const [cookies] = useCookies(['token']);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getCountries({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
    dispatch(
      getCompanies({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <div className="company">
        <h2>Company</h2>
        <Tabs activeTabDefault={activeTab} tabList={tabsData}>
          {tabsData.map((tab) => (
            <Tab key={tab.id} label={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </>
  );
};

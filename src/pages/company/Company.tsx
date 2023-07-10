import './Company.scss';
import { Tab, Tabs } from '../../components/tabs';
import { tabsData } from './config';
import { FC, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../store/hooks';
import { getCompanies, getCompanyInfoForForm, getCountries } from './companySlice';
import { HeaderMain } from '../../components/header';
import { CompanyInfo } from './companyTab/CompanyInfo';
import { Contacts } from './contactsTab/Contacts';
import { Link } from 'react-router-dom';

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
    dispatch(
      getCompanyInfoForForm({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <HeaderMain title={'Company'}>
        <section className="company__header">
          <Link
            className={`company__tab ${
              activeTab === 0 ? 'company__header_active' : 'company__header_noActive'
            }`}
            to="/company"
          >
            <span>Company</span>
          </Link>
          <Link
            className={`company__tab ${
              activeTab === 1 ? 'company__header_active' : 'company__header_noActive'
            }
            }`}
            to="/company/contacts"
          >
            <span>Contacts</span>
          </Link>
        </section>
      </HeaderMain>
      <div className="company">
        {/* <Tabs activeTabDefault={activeTab} tabList={tabsData}>
          {tabsData.map((tab) => (
            <Tab key={tab.id} label={tab.title}>
              {tab.component}
            </Tab>
          ))}
        </Tabs> */}
        {activeTab === 0 && <CompanyInfo />}
        {activeTab === 1 && <Contacts />}
      </div>
    </>
  );
};

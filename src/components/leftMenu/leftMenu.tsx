import { Link, useNavigate } from 'react-router-dom';
import {
  Company,
  Dashboard,
  OrdersView,
  Inventory,
  Live,
  ConfigurationNew,
  Info,
  Logout,
} from '../../assets/svg/SVGcomponent';
import { useEffect, useState } from 'react';
import { getCompanySubsInfo, getUserList } from '../../api/companyRequest';
import { useCookies } from 'react-cookie';
import { CompanyInfo } from './types';
import './styles.scss';
import jwt from 'jwt-decode';

export const LeftMenu = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['token']);
  const [user, setUser] = useState<any>(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name_company: '',
    count_days: '',
  });

  useEffect(() => {
    if (window.location.pathname.includes('dashboard')) {
      document.title = 'Dashboard';
    }
    if (window.location.pathname.includes('live')) {
      document.title = 'Live';
    }
    if (window.location.pathname.includes('orders-view')) {
      document.title = 'Orders View';
    }
    if (window.location.pathname.includes('inventory')) {
      document.title = 'Inventory';
    }
    if (window.location.pathname.includes('configuration')) {
      document.title = 'Configuration';
    }
    if (window.location.pathname.includes('company')) {
      document.title = 'Company';
    }
    if (window.location.pathname.includes('info')) {
      document.title = 'Info';
    }
    if (window.location.pathname === '/') {
      document.title = '5ControlS';
    }
  });

  useEffect(() => {
    getCompanySubsInfo(window.location.hostname, cookies.token)
      .then((response) => {
        setCompanyInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          navigate('/company');
        }
      });

    const token: any = jwt(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk0Njc3NTk4LCJqdGkiOiJhN2Q2MGY4MjgwNjc0N2M4OWMwZTY3YmQ4NDhiY2U5YSIsInVzZXJfaWQiOjF9.P0Wos8JAaoihsjoUV0KUrCdyTPcyHW4YIHeA4K6yeXw'
    );
    getUserList(window.location.hostname, cookies.token).then((response: any) => {
      if (token.user_id && response.data && response.data.results) {
        setUser(response.data.results.find((user: any) => user.id === token.user_id));
      }
    });
  }, []);

  return (
    <aside className="leftMenu">
      <ul>
        <li
          className={window.location.pathname.includes('dashboard') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="dashboard">
            <Dashboard />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={window.location.pathname.includes('live') ? 'activeMenu' : 'noActiveMenu'}>
          <Link to="live">
            <Live />
            <span>Live</span>
          </Link>
        </li>
        <li
          className={
            window.location.pathname.includes('orders-view') ? 'activeMenu' : 'noActiveMenu'
          }
        >
          <Link to="/orders-view">
            <OrdersView />
            <span>Orders View</span>
          </Link>
        </li>
        <li
          className={window.location.pathname.includes('inventory') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="/inventory">
            <Inventory />
            <span>Inventory</span>
          </Link>
        </li>
        <hr></hr>
        <li
          className={
            window.location.pathname.includes('configuration') ? 'activeMenu' : 'noActiveMenu'
          }
        >
          <Link to="/configuration">
            <ConfigurationNew />
            <span>Configuration</span>
          </Link>
        </li>
        <li
          className={window.location.pathname.includes('company') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="/company">
            <Company />
            <span>Company</span>
          </Link>
        </li>
        <li className={window.location.pathname.includes('info') ? 'activeMenu' : 'noActiveMenu'}>
          <Link to="/info">
            <Info />
            <span>Info</span>
          </Link>
        </li>
        <hr></hr>
        <div className="leftMenu__logout">
          <div className="leftMenu__logout_svg" onClick={() => removeCookie('token')}>
            <Logout />
          </div>
          {user && (
            <div className="leftMenu__logout_text">
              <span>{user.username}</span>
              <span
                className={
                  user.status === 'owner'
                    ? 'leftMenu__logout_statusOwner'
                    : 'leftMenu__logout_statusWorker'
                }
              >
                {user.status}
              </span>
            </div>
          )}
        </div>
      </ul>
      <div className={'leftMenu__company'}>
        <h2>{companyInfo.name_company}</h2>
        <h3>{companyInfo.count_days}</h3>
      </div>
    </aside>
  );
};

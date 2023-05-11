import { Link } from 'react-router-dom';
import {
  Company,
  Dashboard,
  OrdersView,
  Inventory,
  Live,
  LogoHorizontal,
  ConfigurationNew,
  Info,
} from '../../assets/svg/SVGcomponent';
import { useEffect, useState } from 'react';
import { getCompanyInfo } from '../../api/companyRequest';
import { useCookies } from 'react-cookie';
import { CompanyInfo } from './types';
import './styles.scss';

export const LeftMenu = () => {
  const [useless, setUseless] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name_company: '',
    days_left: '',
  });

  const send = () => {
    setUseless(!useless);
  };

  useEffect(() => {
    if (window.location.pathname.includes('dashboard')) {
      document.title = 'Dashboard';
    }
    if (window.location.pathname.includes('live')) {
      document.title = 'Live';
    }
    if (window.location.pathname.includes('orders-view')) {
      document.title = 'Orders view';
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
      document.title = '5s Control';
    }
  }, [useless]);

  useEffect(() => {
    getCompanyInfo(window.location.hostname, cookies.token).then((response) => {
      // console.log(response.data)
      setCompanyInfo(response.data);
    });
  }, []);

  return (
    <aside className="leftMenu">
      <Link to="/info" className="leftMenu__logo">
        <LogoHorizontal onClick={send} className="leftMenu__logo_svg" />
      </Link>
      <ul>
        <li
          className={window.location.pathname.includes('dashboard') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="dashboard" onClick={send}>
            <Dashboard />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={window.location.pathname.includes('live') ? 'activeMenu' : 'noActiveMenu'}>
          <Link to="live" onClick={send}>
            <Live />
            <span>Live</span>
          </Link>
        </li>
        <li
          className={
            window.location.pathname.includes('orders-view') ? 'activeMenu' : 'noActiveMenu'
          }
        >
          <Link to="/orders-view" onClick={send}>
            <OrdersView />
            <span>Orders View</span>
          </Link>
        </li>
        <li
          className={window.location.pathname.includes('inventory') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="/inventory" onClick={send}>
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
          <Link to="/configuration" onClick={send}>
            <ConfigurationNew />
            <span>Configuration</span>
          </Link>
        </li>
        <li
          className={window.location.pathname.includes('company') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="/company" onClick={send}>
            <Company />
            <span>Company</span>
          </Link>
        </li>
        <li className={window.location.pathname.includes('info') ? 'activeMenu' : 'noActiveMenu'}>
          <Link to="/info" onClick={send}>
            <Info />
            <span>Info</span>
          </Link>
        </li>
      </ul>
      <div className={'leftMenu__company'}>
        <h2>{companyInfo.name_company}</h2>
        <h3>{companyInfo.days_left}</h3>
      </div>
    </aside>
  );
};

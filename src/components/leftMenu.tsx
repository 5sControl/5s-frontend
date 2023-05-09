import { Link } from 'react-router-dom';
import {
  Company,
  Dashboard,
  OrdersView,
  Algorithm,
  Inventory,
  Live,
} from '../assets/svg/SVGcomponent';
import logo from '../assets/svg/icon.svg';
import { useEffect, useState } from 'react';
import { getCompanyInfo } from '../api/companyRequest';
import { useCookies } from 'react-cookie';

interface CompanyInfo {
  name_company: string;
  days_left: string;
}
export const LeftMenu = () => {
  const [useless, setUseless] = useState(false);
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
      <Link to="/info" onClick={send}>
        <img src={logo} alt="logo" />
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
        <li
          className={
            window.location.pathname.includes('configuration') ? 'activeMenu' : 'noActiveMenu'
          }
        >
          <Link to="/configuration" onClick={send}>
            <Algorithm />
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
      </ul>
      <div className={'leftMenu__company'}>
        <h2>{companyInfo.name_company}</h2>
        <h3>{companyInfo.days_left}</h3>
      </div>
    </aside>
  );
};

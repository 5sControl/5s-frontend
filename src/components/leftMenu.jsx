import { Link } from 'react-router-dom';
import { Company, Dashboard, OrdersView } from '../assets/svg/SVGcomponent';
import logo from '../assets/svg/icon.svg';
import { useEffect, useState } from 'react';
import { getCompanyInfo } from '../api/companyRequest';
import { useCookies } from 'react-cookie';

export const LeftMenu = () => {
  const [useless, setUseless] = useState(false);
  const [cookies] = useCookies(['token']);
  const [companyInfo, setCompanyInfo] = useState([]);
  const send = () => {
    setUseless(!useless);
  };

  useEffect(() => {
    getCompanyInfo(window.location.hostname, cookies.token).then((response) => {
      // console.log(response.data)
      setCompanyInfo(response.data);
    });
  }, []);

  return (
    <aside className="leftMenu">
      <Link to="/" onClick={send}>
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
        <li
          className={window.location.pathname.includes('company') ? 'activeMenu' : 'noActiveMenu'}
        >
          <Link to="/company" onClick={send}>
            <Company />
            <span>Company</span>
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
      </ul>
      <div className={'leftMenu__company'}>
        <h2>{companyInfo.name_company}</h2>
        <h3>{companyInfo.days_left}</h3>
      </div>
    </aside>
  );
};

import { useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { getCompanyInfo, getUserList } from '../../api/companyRequest';

import { AddUser } from './components/addUser';
import { LicenseKey } from './components/licenseKey';
import { UserList } from './components/UserList';
import { AvailableProcess } from './components/availableProcess';
import { Button } from '../../components/button';
import { Plus } from '../../assets/svg/SVGcomponent';
import './Company.scss';

export const Company = () => {
  const [cookies] = useCookies(['token']);
  const [userList, setUserList] = useState([]);
  const [isAddAccount, setIsAddAccount] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [isLicensed, setIsLicensed] = useState(false);
  useEffect(() => {
    getUserList(window.location.hostname, cookies.token).then((res) => {
      console.log(res);
      if (
        res.data.detail !== 'Authentication credentials were not provided.' &&
        res.data.detail !== 'Given token not valid for any token type'
      ) {
        setUserList(res.data.results);
      }
    });
    getCompanyInfo(window.location.hostname, cookies.token)
      .then((response) => {
        setCompanyInfo(response.data);
        setIsLicensed(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLicensed(false);
      });
  }, [isAddAccount]);

  return (
    <>
      <div className="company">
        <h1>Company</h1>
        {Object.keys(companyInfo).length > 0 && isLicensed && (
          <div className="company__name">
            <h3>{companyInfo.name_company}</h3>
            <br></br>
            <h4>Date joined: {moment(companyInfo.date_joined).format('DD-MM-YYYY')}</h4>
            <h4>Days left: {companyInfo.days_left}</h4>
            <h4>Cameras count: {companyInfo.licence_count_cameras}</h4>
            <h4>Active neurons: {companyInfo.licence_neurons_active}</h4>
            <h4>Active count cameras: {companyInfo.company_active_count_cameras}</h4>
            <h4>Active count neurons: {companyInfo.company_active_count_neurons}</h4>
          </div>
        )}

        <LicenseKey cookies={cookies.token} />
        <AvailableProcess />
        <div className="company__accounts_tab">
          <h2>Accounts</h2>
          <Button
            className="company__add"
            text="Add account"
            onClick={() => setIsAddAccount(true)}
            IconLeft={Plus}
          />
        </div>
        <UserList userList={userList} />

        {isAddAccount && (
          <AddUser
            close={() => {
              setIsAddAccount(false);
            }}
          />
        )}
      </div>
    </>
  );
};

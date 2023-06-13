import { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { getCompanyInfo, getUserList } from '../../../api/companyRequest';

import { AddUser } from '../components/addUser';
import { LicenseKey } from '../components/licenseKey';
import { UserList } from '../components/UserList';
import { AvailableProcess } from '../components/availableProcess';
import { Button } from '../../../components/button';
import { Plus } from '../../../assets/svg/SVGcomponent';

import { CompanyInfoType } from '../types';
import { CompanyCard } from '../../../components/companyCard/companyCard';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import { companyState } from '../companySlice';

export const CompanyInfo: FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const { companyInfoForm } = useAppSelector(companyState);
  const [userList, setUserList] = useState([]);
  const [isAddAccount, setIsAddAccount] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>();
  const [isLicensed, setIsLicensed] = useState(false);

  useEffect(() => {
    getUserList(window.location.hostname, cookies.token).then((res) => {
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

  useEffect(() => {
    console.log('companyInfo', companyInfo);
  }, [companyInfo]);

  return (
    <>
      <div className="company">
        {companyInfo && (
          <CompanyCard
            companyData={companyInfoForm[0]}
            onClick={() => {
              navigate('/company/edit');
            }}
          />
        )}

        {companyInfo && Object.keys(companyInfo).length > 0 && isLicensed && (
          <div className="company__name">
            <h3>5S CONTROL</h3>
            <br></br>
            <h4>Date joined: {moment(companyInfo.date_joined).format('DD-MM-YYYY')}</h4>
            <h4>company_active_count_cameras: {companyInfo.company_active_count_cameras}</h4>
            <h4>licence_count_cameras: {companyInfo.licence_count_cameras}</h4>
            <h4>licence_is_active: {companyInfo.licence_is_active}</h4>
            <h4>licence_neurons_active: {companyInfo.licence_neurons_active}</h4>
            <h4>days_left: {companyInfo.days_left}</h4>
            <h4>valid_until: {companyInfo.valid_until}</h4>
            <h4>company_active_count_neurons: {companyInfo.company_active_count_neurons}</h4>
            <h4>name_company: {companyInfo.name_company}</h4>
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

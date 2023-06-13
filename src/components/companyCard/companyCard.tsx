import { FC } from 'react';
import style from './companyCard.module.scss';
import City from '../../assets/png/city.png';
import { ContactInfoType } from '../../pages/company/types';

type Props = {
  companyData: ContactInfoType;
  onClick: () => void;
};

export const CompanyCard: FC<Props> = ({ companyData, onClick }) => {
  return (
    <article className={style.container} onClick={onClick}>
      <img src={City} alt="" />
      {companyData && (
        <div className={style.infoContainer}>
          <h5>{companyData.name_company}</h5>
          <span>{companyData.city}</span>
          <span>{companyData.contact_email}</span>
        </div>
      )}
    </article>
  );
};

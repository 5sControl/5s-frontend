import { FC } from 'react';
import style from './companyCard.module.scss';
import City from '../../assets/png/city.png';

type Props = {
  title: string;
  city: string;
  email: string;
  onClick: () => void;
};

export const CompanyCard: FC<Props> = ({ title, city, email, onClick }) => {
  return (
    <article className={style.container} onClick={onClick}>
      <img src={City} alt="" />
      <div className={style.infoContainer}>
        <h5>{title}</h5>
        <span>{city}</span>
        <span>{email}</span>
      </div>
    </article>
  );
};

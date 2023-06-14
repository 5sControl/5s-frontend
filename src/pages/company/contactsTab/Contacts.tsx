import { FC, useEffect, useState } from 'react';
import { Button } from '../../../components/button';
import { Plus } from '../../../assets/svg/SVGcomponent';
import { CompanyCard } from '../../../components/companyCard/companyCard';
import { useNavigate } from 'react-router-dom';
import { ContactInfoType } from '../types';
import style from './contacts.module.scss';
import { useAppSelector } from '../../../store/hooks';
import { companyState } from '../companySlice';

export const Contacts: FC = () => {
  const navigate = useNavigate();
  const { companies } = useAppSelector(companyState);

  const [contactsInfo, setContactsInfo] = useState<ContactInfoType[]>([]);

  useEffect(() => {
    setContactsInfo(companies);
  }, [companies]);

  const goToSettings = (id: number) => {
    navigate(`/company/contacts/${id}`);
  };

  return (
    <>
      <div className="contacts">
        <div className={style.title_contacts_box}>
          <h2>Contacts</h2>
          <Button
            text="Add Contact"
            onClick={() => navigate('/company/contacts/newContact')}
            IconLeft={Plus}
          />
        </div>

        <section className={style.contacts_box}>
          {contactsInfo.map((item) => {
            return (
              <CompanyCard
                key={item.id}
                companyData={item}
                onClick={() => {
                  item.id && goToSettings(item.id);
                }}
              />
            );
          })}
        </section>
      </div>
    </>
  );
};

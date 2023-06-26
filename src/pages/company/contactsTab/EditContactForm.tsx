import React, { ChangeEvent, useEffect, useState } from 'react';
import style from './contacts.module.scss';
import { deleteSuppliers, editSuppliers } from '../../../api/companyRequest';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GoBack, Settings } from '../../../assets/svg/SVGcomponent';
import { Button } from '../../../components/button';
import { ContactInfoType } from '../types';
import { ActionList } from './ActionList';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { companyState, getCompanies } from '../companySlice';
import ContactForm from '../components/ContactForm';
import { EMAIL_REGEXP } from '../config';
import { HeaderMain } from '../../../components/header';

export const EditContactForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const { countryData, companies } = useAppSelector(companyState);

  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [address1, setAddress1] = useState<string | null>(null);
  const [address2, setAddress2] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [zipIndex, setZipIndex] = useState<string | null>(null);
  const [zipIndexError, setZipIndexError] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contactsInfo, setContactsInfo] = useState<ContactInfoType[]>([]);
  const [contact, setContact] = useState<ContactInfoType>();
  const [isShowActions, setIsShowActions] = useState<boolean>(false);
  const [logo, setLogo] = useState<File | string | null>(null);
  useEffect(() => {
    dispatch(
      getCompanies({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  useEffect(() => {
    setContactsInfo(companies);
  }, [companies]);

  useEffect(() => {
    setContact(contactsInfo.filter((item) => item.id === Number(id))[0]);
  }, [contactsInfo]);

  useEffect(() => {
    if (contact) {
      const previousCountry = countryData.find((item) => item.code === contact.country);

      contact.name_company && setName(contact.name_company);
      contact.contact_email && setEmail(contact.contact_email);
      contact.website && setWebsite(contact.website);
      contact.city && setCity(contact.city);
      contact.contact_mobile_phone && setMobile(contact.contact_mobile_phone);
      contact.contact_phone && setPhone(contact.contact_phone);
      contact.first_address && setAddress1(contact.first_address);
      contact.second_address && setAddress2(contact.second_address);
      contact.state && setState(contact.state);
      contact.index && setZipIndex(contact.index.toString());
      contact.logo && setLogo(contact.logo);
      previousCountry && setCountry(previousCountry.name);
    }
  }, [contact]);

  const goToContacts = () => {
    navigate('/company/contacts/');
  };

  const editContact = () => {
    if (!name || name.length < 1) {
      setNameError('Name field is required');
      return;
    }
    if (!email || email.length < 1) {
      setEmailError('Name field is required');
      return;
    }
    if (!EMAIL_REGEXP.test(email)) {
      setEmailError('Email is not correct');
      return;
    }
    if (zipIndex && (!/^[\d]*$/.test(zipIndex) || zipIndex.length > 9)) {
      setZipIndexError('ZIP index is not correct');
      return;
    }
    const data: ContactInfoType = {
      name_company: name,
      contact_email: email,
      website: website,
      city: city,
      contact_phone: phone,
      contact_mobile_phone: mobile,
      first_address: address1,
      second_address: address2,
      state: state,
      index: Number(zipIndex),
    };
    data.country = country === '' ? null : country;
    if (!(typeof logo === 'string')) {
      data.logo = logo;
    }

    setIsLoading(true);

    editSuppliers(window.location.hostname, cookies.token, id, data)
      .then(() => {
        goToContacts();
      })
      .catch((err) => {
        console.log('setSuppliersError', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(null);
  };

  const changeEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const changeZipIndexHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setZipIndex(e.target.value);
    setZipIndexError(null);
  };

  const deleteContact = () => {
    setIsLoading(true);

    deleteSuppliers(window.location.hostname, cookies.token, id)
      .then(() => {
        goToContacts();
      })
      .catch((err) => {
        console.log('setSuppliersError', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={style.container}>
      <HeaderMain title={'Contacts'}>
        <div className="company__header">
          <Link to="/company">Company</Link>
          <Link to="/company/contacts" className={'company__header_active'}>
            Contacts
          </Link>
        </div>
      </HeaderMain>
      <div className={style.breadcrumbs}>
        <span className={style.breadcrumbs_active} onClick={goToContacts}>
          Company
        </span>
        <span>{' / '}</span>
        <span>{contact?.name_company}</span>
      </div>

      <div className={style.title_box}>
        <div className={style.title_go_back}>
          <h2>Edit Contact</h2>
          <GoBack className={style.arrow_go_back} onClick={goToContacts} />
        </div>

        <div className={style.control_box}>
          <Button
            className={style.settings_icon}
            IconLeft={Settings}
            text="Action"
            variant={'text'}
            onClick={() => {
              setIsShowActions(true);
            }}
          />
          <Button text="Save" onClick={() => editContact()} disabled={isLoading} />
        </div>
        {isShowActions && (
          <ActionList deleteAction={deleteContact} hideList={() => setIsShowActions(false)} />
        )}
      </div>

      <ContactForm
        name={name}
        email={email}
        city={city}
        setCountry={setCountry}
        setWebsite={setWebsite}
        changeZipIndexHandler={changeZipIndexHandler}
        address1={address1}
        address2={address2}
        changeNameHandler={changeNameHandler}
        country={country}
        mobile={mobile}
        nameError={nameError}
        emailError={emailError}
        phone={phone}
        setAddress1={setAddress1}
        setAddress2={setAddress2}
        setCity={setCity}
        changeEmailHandler={changeEmailHandler}
        setMobile={setMobile}
        setPhone={setPhone}
        setState={setState}
        state={state}
        website={website}
        zipIndex={zipIndex}
        zipIndexError={zipIndexError}
        logo={logo}
        setLogo={setLogo}
      />
    </div>
  );
};

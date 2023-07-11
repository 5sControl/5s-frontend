import React, { ChangeEvent, useState } from 'react';
import style from './contacts.module.scss';
import { createSuppliers } from '../../../api/companyRequest';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button } from '../../../components/button';
import { ContactInfoType } from '../types';
import { GoBack } from '../../../assets/svg/SVGcomponent';
import ContactForm from '../components/ContactForm';
import { EMAIL_REGEXP } from '../config';
import { HeaderMain } from '../../../components/header';

export const NewContactForm = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);

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
  const [logo, setLogo] = useState<File | string | null>(null);

  const goToContacts = () => {
    navigate('/company/contacts/');
  };

  const createContact = () => {
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
      logo: logo,
      index: Number(zipIndex),
    };
    data.country = country === '' ? null : country;

    setIsLoading(true);

    createSuppliers(window.location.hostname, cookies.token, data)
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

  return (
    <div className={style.container}>
      <HeaderMain title={'Contacts'}>
        <section className="company__header">
          <Link className={`company__tab ${'company__header_noActive'}`} to="/company">
            <span>Company</span>
          </Link>
          <Link
            className={`company__tab ${'company__header_active'}
            }`}
            to="/company/contacts"
          >
            <span>Contacts</span>
          </Link>
        </section>
      </HeaderMain>
      <div className={style.breadcrumbs}>
        <span className={style.breadcrumbs_active} onClick={goToContacts}>
          Company
        </span>
        <span>{' / '}</span>
        <span>New contact</span>
      </div>

      <div className={style.title_box}>
        <div className={style.title_go_back}>
          <h2>New Contact</h2>
          <GoBack className={style.arrow_go_back} onClick={goToContacts} />
        </div>
        <div className={style.control_box}>
          <Button text="Done" onClick={() => createContact()} disabled={isLoading} />
        </div>
      </div>

      <ContactForm
        name={name}
        email={email}
        city={city}
        setCountry={setCountry}
        setWebsite={setWebsite}
        changeEmailHandler={changeEmailHandler}
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
        changeZipIndexHandler={changeZipIndexHandler}
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

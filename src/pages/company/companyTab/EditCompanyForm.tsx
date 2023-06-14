import React, { ChangeEvent, useEffect, useState } from 'react';
import style from '../contactsTab/contacts.module.scss';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { GoBack } from '../../../assets/svg/SVGcomponent';
import { Button } from '../../../components/button';
import { ContactInfoType } from '../types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { companyState, getCompanies, getCompanyInfoForForm } from '../companySlice';
import ContactForm from '../components/ContactForm';
import { EMAIL_REGEXP } from '../config';
import { AxiosError } from 'axios';
import { createCompanyInfoForm, editCompanyInfoForm } from '../../../api/companyRequest';

export const EditCompanyForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const { countryData, companyInfoForm } = useAppSelector(companyState);

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
  const [countryError, setCountryError] = useState<string | null>(null);
  const [zipIndex, setZipIndex] = useState<string | null>(null);
  const [zipIndexError, setZipIndexError] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState<ContactInfoType>(companyInfoForm[0]);

  const goToCompany = () => {
    navigate('/company/');
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
    if (!country || country.length < 1) {
      setCountryError('Country field is required');
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

    let currentCountry: string | undefined | null = countryData.find(
      (item) => item.name === country
    )?.code;
    if (!currentCountry) {
      currentCountry = null;
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
      country: currentCountry,
      index: Number(zipIndex),
    };

    setIsLoading(true);

    contact
      ? editCompanyInfoForm(window.location.hostname, cookies.token, data, contact.id)
          .then(() => {
            goToCompany();
          })
          .catch((err: AxiosError) => {
            console.log('setSuppliersError', err);
          })
          .finally(() => {
            setIsLoading(false);
          })
      : createCompanyInfoForm(window.location.hostname, cookies.token, data)
          .then(() => {
            goToCompany();
          })
          .catch((err: AxiosError) => {
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

  const changeCountryHandler = (country: string | null) => {
    setCountry(country);
    setCountryError(null);
  };

  useEffect(() => {
    dispatch(
      getCompanies({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
    dispatch(
      getCompanyInfoForForm({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  useEffect(() => {
    console.log('companyInfoForm', companyInfoForm);
    setContact(companyInfoForm[0]);
  }, [companyInfoForm]);

  useEffect(() => {
    console.log('contact', contact);
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
      previousCountry && setCountry(previousCountry.name);
    }
  }, [contact]);

  return (
    <div className={style.container}>
      <div className={style.breadcrumbs}>
        <span className={style.breadcrumbs_active} onClick={goToCompany}>
          Company
        </span>
        <span>{' / '}</span>
        <span>{contact?.name_company}</span>
      </div>

      <div className={style.title_box}>
        <div className={style.title_go_back}>
          <h2>Edit Company</h2>
          <GoBack className={style.arrow_go_back} onClick={goToCompany} />
        </div>

        <div className={style.control_box}>
          <Button text="Save" onClick={() => editContact()} disabled={isLoading} />
        </div>
      </div>

      <ContactForm
        name={name}
        email={email}
        city={city}
        changeCountryHandler={changeCountryHandler}
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
        countryError={countryError}
      />
    </div>
  );
};

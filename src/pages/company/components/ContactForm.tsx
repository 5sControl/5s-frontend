import React, { ChangeEvent, useEffect, useState } from 'react';
import style from '../contactsTab/contacts.module.scss';
import { Input } from '../../../components/input';
import Combobox from 'react-widgets/Combobox';
import { ArrowDown } from '../../../assets/svg/SVGcomponent';
import { useAppSelector } from '../../../store/hooks';
import { companyState } from '../companySlice';

type PropsType = {
  name: string | null;
  nameError: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipIndex: string | null;
  country: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  emailError: string | null;
  website: string | null;
  zipIndexError: string | null;

  changeNameHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  changeEmailHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  changeZipIndexHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  setAddress1: (data: string | null) => void;
  setAddress2: (data: string | null) => void;
  setCity: (data: string | null) => void;
  setState: (data: string | null) => void;
  setPhone: (data: string | null) => void;
  setMobile: (data: string | null) => void;
  setWebsite: (data: string | null) => void;
  setCountry: (country: string | null) => void;
};

export const ContactForm: React.FC<PropsType> = ({
  name,
  nameError,
  address1,
  address2,
  city,
  state,
  zipIndex,
  country,
  phone,
  mobile,
  email,
  emailError,
  website,
  changeNameHandler,
  setAddress1,
  setAddress2,
  setCity,
  setState,
  setPhone,
  setMobile,
  setWebsite,
  setCountry,
  zipIndexError,
  changeEmailHandler,
  changeZipIndexHandler,
}) => {
  const { countryData } = useAppSelector(companyState);
  const [countryList, setCountryList] = useState<string[]>([]);

  useEffect(() => {
    const countries = countryData.map((item) => item.name);
    setCountryList(countries);
  }, [countryData]);

  return (
    <div className={style.form_container}>
      <section className={style.name_section}>
        <div className={style.name_input_wrap}>
          <Input
            id={'name'}
            name={'name'}
            type="text"
            value={name || undefined}
            onChange={changeNameHandler}
            placeholder={'Enter name'}
            className={style.input_style}
            label={'Name'}
            required
            errorMessage={nameError}
          />
        </div>
      </section>

      <div className={style.second_Line}>
        <section className={style.address_section}>
          <Input
            id={'address1'}
            name={'address1'}
            type="text"
            value={address1 || undefined}
            onChange={(e) => setAddress1(e.target.value)}
            placeholder={'Enter street 1...'}
            className={style.input_style}
            label={'Address'}
          />
          <Input
            id={'address2'}
            name={'address2'}
            type="text"
            value={address2 || undefined}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder={'Enter street 2...'}
            className={style.input_style}
          />

          <div className={style.three_input_box}>
            <Input
              id={'city'}
              name={'city'}
              type="text"
              placeholder={'Enter city'}
              className={style.input_style}
              value={city || undefined}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              id={'state'}
              name={'state'}
              type="text"
              placeholder={'Enter state'}
              className={style.input_style}
              value={state || undefined}
              onChange={(e) => setState(e.target.value)}
            />
            <Input
              id={'zipIndex'}
              name={'zipIndex'}
              type="text"
              placeholder={'Enter ZIP'}
              className={style.input_style}
              value={zipIndex?.toString()}
              onChange={changeZipIndexHandler}
              errorMessage={zipIndexError}
            />
          </div>

          <Combobox
            data={countryList}
            placeholder="Enter country"
            hideEmptyPopup
            value={country}
            onChange={(value) => setCountry(value)}
            onSelect={(value) => setCountry(value)}
            className={style.combobox_style}
            selectIcon={<ArrowDown />}
          />
        </section>

        <section className={style.contacts_section}>
          <Input
            id={'phone'}
            name={'phone'}
            type="text"
            value={phone || undefined}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={'Enter phone'}
            className={style.input_style}
            label={'Contacts'}
          />
          <Input
            id={'mobile'}
            name={'mobile'}
            type="text"
            value={mobile || undefined}
            onChange={(e) => setMobile(e.target.value)}
            placeholder={'Enter mobile'}
            className={style.input_style}
          />
          <Input
            id={'email'}
            name={'email'}
            type="text"
            value={email || undefined}
            onChange={changeEmailHandler}
            placeholder={'Enter email'}
            className={style.input_style}
            required
            errorMessage={emailError}
          />
          <Input
            id={'website'}
            name={'website'}
            type="text"
            value={website || undefined}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={'Enter website'}
            className={style.input_style}
          />
        </section>
      </div>
    </div>
  );
};

export default ContactForm;

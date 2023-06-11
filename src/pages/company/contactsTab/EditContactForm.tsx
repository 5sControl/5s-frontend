import React, { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '../../../components/input';
import style from './contacts.module.scss';
import { deleteSuppliers, editSuppliers, getSuppliers } from '../../../api/companyRequest';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ArrowDown, GoBack, Settings } from '../../../assets/svg/SVGcomponent';
import { Button } from '../../../components/button';
import { ContactInfoType } from '../types';
import { ActionList } from './ActionList';
import Combobox from 'react-widgets/Combobox';
import { useAppSelector } from '../../../store/hooks';
import { companyState } from '../companySlice';

export const EditContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const { countryData } = useAppSelector(companyState);

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zipIndex, setZipIndex] = useState<number | null>(null);
  const [state, setState] = useState('');
  const [countryList, setCountryList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactsInfo, setContactsInfo] = useState<ContactInfoType[]>([]);
  const [contact, setContact] = useState<ContactInfoType>();
  const [isShowActions, setIsShowActions] = useState<boolean>(false);

  useEffect(() => {
    getSuppliers(window.location.hostname, cookies.token)
      .then((response) => {
        console.log('setContactsInfo', response.data);
        setContactsInfo(response.data);
      })
      .catch((err) => {
        console.log('setCompanyInfoError', err);
      });
  }, []);

  useEffect(() => {
    setContact(contactsInfo.filter((item) => item.id === Number(id))[0]);
  }, [contactsInfo]);

  useEffect(() => {
    const countries = countryData.map((item) => item.name);
    setCountryList(countries);
  }, [countryData]);

  useEffect(() => {
    if (contact) {
      const previousCountry = countryData.find((item) => item.code === contact.country);

      setName(contact.name_company);
      setEmail(contact.contact_email);
      setWebsite(contact.website);
      contact.city && setCity(contact.city);
      contact.contact_mobile_phone && setMobile(contact.contact_mobile_phone);
      contact.contact_phone && setPhone(contact.contact_phone);
      contact.first_address && setAddress1(contact.first_address);
      contact.second_address && setAddress2(contact.second_address);
      contact.state && setState(contact.state);
      contact.index && setZipIndex(contact.index);
      previousCountry && setCountry(previousCountry.name);
    }
  }, [contact]);

  const goToContacts = () => {
    navigate('/company/contacts/');
  };

  const editContact = () => {
    if (name.length < 1) {
      setNameError('Name field is required');
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

      <div className={style.form_container}>
        <section className={style.name_section}>
          <div className={style.name_input_wrap}>
            <Input
              id={'name'}
              name={'name'}
              type="text"
              value={name}
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
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder={'Enter street 1...'}
              className={style.input_style}
              label={'Address'}
            />
            <Input
              id={'address2'}
              name={'address2'}
              type="text"
              value={address2}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                id={'state'}
                name={'state'}
                type="text"
                placeholder={'Enter state'}
                className={style.input_style}
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <Input
                id={'zipIndex'}
                name={'zipIndex'}
                type="text"
                placeholder={'Enter ZIP'}
                className={style.input_style}
                value={zipIndex?.toString()}
                onChange={(e) => setZipIndex(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={'Enter phone'}
              className={style.input_style}
              label={'Contacts'}
            />
            <Input
              id={'mobile'}
              name={'mobile'}
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={'Enter mobile'}
              className={style.input_style}
            />
            <Input
              id={'email'}
              name={'email'}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Enter email'}
              className={style.input_style}
            />
            <Input
              id={'website'}
              name={'website'}
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={'Enter website'}
              className={style.input_style}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

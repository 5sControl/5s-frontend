import React, { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '../../../components/input';
import style from './contacts.module.scss';
import { SelectBase } from '../../../components/selectBase';
import { createSuppliers } from '../../../api/companyRequest';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button } from '../../../components/button';

export const NewContactForm = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goToContacts = () => {
    navigate('/company/contacts/');
  };

  const createContact = () => {
    if (name.length < 1) {
      setNameError('Name field is required');
      return;
    }
    const data = {
      name_company: name,
      contact_email: email,
      website: website,
      city: city,
    };
    setIsLoading(true);

    createSuppliers(window.location.hostname, cookies.token, data)
      .then((response) => {
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

  return (
    <div className={style.container}>
      <div className={style.breadcrumbs}>
        <span className={style.breadcrumbs_active} onClick={goToContacts}>
          Company
        </span>
        <span>{' / '}</span>
        <span>New contact</span>
      </div>

      <div className={style.title_box}>
        <h2>New Contact</h2>
        <div className={style.control_box}>
          <Button text="Done" onClick={() => createContact()} disabled={isLoading} />
        </div>
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
              placeholder={'Enter street 1...'}
              className={style.input_style}
              label={'Address'}
              disabled
            />
            <Input
              id={'address2'}
              name={'address2'}
              type="text"
              placeholder={'Enter street 2...'}
              className={style.input_style}
              disabled
            />

            <div className={style.three_input_box}>
              <Input
                id={'city'}
                name={'city'}
                type="text"
                placeholder={'Enter city'}
                className={style.input_style}
                onChange={(e) => setCity(e.target.value)}
              />
              <SelectBase
                id={'state'}
                name={'state'}
                listOfData={[{ id: 0, text: 'Enter state' }]}
                className={style.select_style}
                disabled
              />
              <input type="file" disabled />
            </div>

            <SelectBase
              id="country"
              name="country"
              listOfData={[{ id: 0, text: 'Enter country' }]}
              className={style.select_style}
              disabled
            />
          </section>

          <section className={style.contacts_section}>
            <Input
              id={'phone'}
              name={'phone'}
              type="text"
              placeholder={'Enter phone'}
              className={style.input_style}
              label={'Contacts'}
              disabled
            />
            <Input
              id={'mobile'}
              name={'mobile'}
              type="text"
              placeholder={'Enter mobile'}
              className={style.input_style}
              disabled
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
              placeholder={'Enter website'}
              className={style.input_style}
              disabled
            />
          </section>
        </div>
      </div>
    </div>
  );
};

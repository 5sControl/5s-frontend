import React, { useEffect, useState } from 'react';
import { Input } from '../../../components/input';
import style from './companyInfoForm.module.scss';
import { SelectBase } from '../../../components/selectBase';
import { getSuppliers, setSuppliers } from '../../../api/companyRequest';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const NewContactForm = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const createContact = () => {
    const data = {
      name_company: name,
      contact_email: email,
      website: website,
    };

    setSuppliers(window.location.hostname, cookies.token, data)
      .then((response) => {
        console.log('setSuppliers', response.data);
      })
      .catch((err) => {
        console.log('setSuppliersError', err);
      });
  };

  return (
    <div className={style.container}>
      <div className={style.breadcrumbs}>
        <span
          onClick={() => {
            createContact();
          }}
        >
          Company
        </span>
        <span>{' / '}</span>
        <span>New contact</span>
      </div>

      <div>
        <h2>New Contact</h2>
      </div>

      <div className={style.form_container}>
        <section className={style.name_section}>
          <div className={style.name_input_wrap}>
            <Input
              id={'name'}
              name={'name'}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'Enter name'}
              className={style.input_style}
              label={'Name'}
              required
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
            />
            <Input
              id={'address2'}
              name={'address2'}
              type="text"
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
              />
              <SelectBase
                id={'state'}
                name={'state'}
                listOfData={[{ id: 0, text: 'Enter state' }]}
                className={style.select_style}
              />
              <input type="file" />
            </div>

            <SelectBase
              id="camera_type"
              name="camera_type"
              listOfData={[{ id: 0, text: 'Enter city' }]}
              className={style.select_style}
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
            />
            <Input
              id={'mobile'}
              name={'mobile'}
              type="text"
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
              placeholder={'Enter website'}
              className={style.input_style}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

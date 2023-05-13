/* eslint-disable no-unused-vars */
import { useState } from 'react';

import { registerNewUser } from '../../../api/companyRequest';

import './addUser.scss';
import { useCookies } from 'react-cookie';

export const AddUser = ({ close }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [cookies] = useCookies(['token']);
  const [error, setError] = useState('');
  const registration = () => {
    registerNewUser(window.location.hostname, cookies.token, email, password, role)
      .then((res) => {
        if (res.status === 201) {
          close();
        }
      })
      .catch((err) => {
        console.log(err.response);
        setError(err.response.data.error);
      });
  };

  return (
    <div className="add-user">
      <div className="add-user__container">
        <h3>Adding account</h3>
        <h5>Email</h5>
        <label>Set email that will be used to log in.</label>
        <input
          className="add-user__input"
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h5>Password</h5>
        <label>Set password that will be used to log in.</label>
        <input
          className="add-user__input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h5>Role</h5>
        <label>Select a role of the account.</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="add-user__select">
          <option value="">Select role</option>
          <option value={'worker'}>worker</option>
          <option value={'admin'}>staff</option>
        </select>
        {error.length > 0 && <span style={{ color: 'red' }}>{error}</span>}
        <div className="add-user__footer">
          <button className="add-user__cancel" onClick={close}>
            Cancel
          </button>
          <button className="add-user__create" onClick={registration}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

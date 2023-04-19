/* eslint-disable no-unused-vars */
import { useState } from 'react';

import { registerNewUser } from '../../../api/companyRequest';

import './addUser.scss';
export const AddUser = ({ close }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const registration = () => {
    registerNewUser(window.location.hostname, email, password, role).then((res) => {
      // console.log(res);
      if (res.data.message === 'User has been successfully created') {
        close();
      }
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
          <option value={'Worker'}>Worker</option>
          <option value={'Staff'}>Staff</option>
        </select>
        <div className="add-user__footer">
          <button className="add-user__cancel" onClick={close}>
            Cancel
          </button>
          <button className="add-user__create" onClick={registration}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

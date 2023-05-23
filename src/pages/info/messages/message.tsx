import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getSystemMessage } from '../../../api/companyRequest';

import styles from './message.module.scss';

export const SystemMessage = () => {
  const [messages, setMessges] = useState([]);
  const [cookies] = useCookies(['token']);
  useEffect(() => {
    getSystemMessage(window.location.hostname, cookies.token).then((response) => {
      console.log(response);
    });
  });
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}></div>
      <footer className={styles.footer}>{'< 1 >'}</footer>
    </section>
  );
};

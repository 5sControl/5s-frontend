import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getSystemMessage } from '../../../api/companyRequest';

import styles from './message.module.scss';
import { Preloader } from '../../../components/preloader';

export const SystemMessage = () => {
  const [messages, setMessges] = useState([]);
  const [cookies] = useCookies(['token']);
  const [isPreloader, serIsPreloader] = useState<boolean>(true);
  useEffect(() => {
    getSystemMessage(window.location.hostname, cookies.token)
      .then((response) => {
        serIsPreloader(false);
        setMessges(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        serIsPreloader(false);
      });
  }, []);
  return (
    <section className={styles.wrapper}>
      {isPreloader ? (
        <Preloader />
      ) : (
        <>
          <div className={styles.container}>
            {messages.length === 0 ? (
              <div className={styles.empty}>Empty</div>
            ) : (
              <div>no Empty</div>
            )}
          </div>
          {<footer className={styles.footer}>{'< 1 >'}</footer>}
        </>
      )}
    </section>
  );
};

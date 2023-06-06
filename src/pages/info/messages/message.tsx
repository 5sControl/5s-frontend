/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { getSystemMessage } from '../../../api/companyRequest';

import styles from './message.module.scss';
import { Preloader } from '../../../components/preloader';
import moment from 'moment';
import { PaginatorRight } from '../../../assets/svg/SVGcomponent';

export const SystemMessage = () => {
  const [messages, setMessges] = useState<any>(false);
  const [cookies] = useCookies(['token']);
  const [isPreloader, setIsPreloader] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setIsPreloader(true);
    getSystemMessage(window.location.hostname, cookies.token, page)
      .then((response) => {
        setIsPreloader(false);
        setMessges(response.data);
      })
      .catch((error) => {
        console.log(error);
        setIsPreloader(false);
      });
  }, [page]);

  const prevPage = () => {
    setPage(page - 1);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  return (
    <section className={styles.wrapper}>
      {isPreloader || !messages ? (
        <Preloader />
      ) : (
        <>
          <div className={styles.container}>
            {messages.count === 0 || messages.length === 0 ? (
              <div className={styles.empty}>
                <h1>No messages</h1>
                <p>You don’t have system messages yet</p>
              </div>
            ) : (
              <>
                {messages.results.map((element: any, index: number) => (
                  <div className={styles.item} key={index}>
                    <div className={styles.item__head}>
                      <h5>{element.title}</h5>
                      {element.created_at && (
                        <time>{moment(element.created_at).format('DD.MM.YYYY | HH:MM:ss')}</time>
                      )}
                    </div>
                    <span className={styles.item__content}>{element.content}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          {messages.count > 0 && (
            <footer className={styles.footer}>
              <PaginatorRight
                className={`${styles.left} ${!messages.previous && styles.disable}`}
                onClick={prevPage}
              />
              <span className={styles.page}>
                {page}&nbsp; page of &nbsp;{messages.all_page_count}
              </span>
              <PaginatorRight
                className={`${styles.right} ${!messages.next && styles.disable}`}
                onClick={nextPage}
              />
            </footer>
          )}
        </>
      )}
    </section>
  );
};

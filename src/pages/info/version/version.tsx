import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import styles from './info.module.scss';
import { getCompanyVersionAsync, selectInfoPage } from './infoSlice';
import moment from 'moment';

export const Version: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const { version, isErrorCompanyVersions, isLoadingCompanyVersions } =
    useAppSelector(selectInfoPage);

  useEffect(() => {
    dispatch(
      getCompanyVersionAsync({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);
  return (
    <section>
      <div className={styles.version_app}>
        {isLoadingCompanyVersions ? (
          <span className={styles.version_row_title}>5S Control version: Loading...</span>
        ) : (
          <>
            <h3>Product version</h3>
            <div className={styles.version_row}>
              <span className={styles.version_row_title}>{version[0]?.name}: </span>
              <div className={styles.version_row_text}>
                <span>{version[0]?.version} </span>
                <span>{moment(version[0]?.date).format('DD.MM.YYYY')} </span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.version_app}>
        <h3>Algorithms versions</h3>
        {isLoadingCompanyVersions ? (
          <span className={styles.version_row_title}>Loading...</span>
        ) : (
          <div className={styles.version}>
            {version.map(({ name, version, date, description }, index) => {
              if (index === 0) {
                return;
              }
              return (
                <div key={index} className={styles.version_row}>
                  <span className={styles.version_row_title}>{name}: </span>
                  <div className={styles.version_row_text}>
                    <span>{version} </span>
                    <span>{moment(date).format('DD.MM.YYYY')} </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.links}>
        <a href="https://5controls.com/" target="_blank" rel="noreferrer">
          Website
        </a>
        <a href="https://5controls.com/privacy" target="_blank" rel="noreferrer">
          Privacy policy
        </a>
        <a href="https://5controls.com/terms-conditions" target="_blank" rel="noreferrer">
          Terms of use
        </a>
      </div>
    </section>
  );
};

import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { WrapperPage } from '../../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import styles from './info.module.scss';
import { getCompanyVersionAsync, selectInfoPage } from './infoSlice';

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
    <main>
      <div className={styles.version_app}>
        {isLoadingCompanyVersions ? (
          <span className={styles.version_row_title}>5S Control version: Loading...</span>
        ) : (
          <>
            <h3>Product version</h3>
            <p className={styles.version_row}>
              <span className={styles.version_row_title}>{version[0]?.name}: </span>
              {version[0]?.version}
            </p>
          </>
        )}
      </div>
      <div className={styles.version_app}>
        <h3>Product version</h3>
        {isLoadingCompanyVersions ? (
          <span className={styles.version_row_title}>Loading...</span>
        ) : (
          <div className={styles.version}>
            {version.map(({ name, version }, index) => {
              if (index === 0) {
                return;
              }

              return (
                <p key={index} className={styles.version_row}>
                  <span className={styles.version_row_title}>{name}: </span>
                  {version}
                </p>
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
    </main>
  );
};

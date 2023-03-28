import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './info.module.scss';
import { getCompanyVersionAsync, selectInfoPage } from './infoSlice';

export const Info: React.FC = () => {
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

  useEffect(() => {
    console.log('version', version);
  }, [version]);

  return (
    <WrapperPage title="5S Control">
      <div className={styles.links}>
        <Link to="/">Website</Link>
        <Link to="/">Privacy policy</Link>
        <Link to="/">Terms of use</Link>
      </div>

      <p className={styles.version_app}>
        {isLoadingCompanyVersions ? (
          <span className={styles.version_row_title}>5S Control version: Loading...</span>
        ) : (
          <>
            <span className={styles.version_row_title}>{version[0]?.name}: </span>
            {version[0]?.version}
          </>
        )}
      </p>

      <p className={styles.algorithms_title}>Algorithms versions</p>

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
    </WrapperPage>
  );
};

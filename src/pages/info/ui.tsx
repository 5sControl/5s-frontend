import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPreviewOrders } from '../previewOrders/previewOrdersSlice';
import styles from './info.module.scss';
import { getCompanyVersionAsync, selectInfoPage } from './infoSlice';

export const Info: React.FC = () => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(['token']);
  const { version, isErrorCompanyVersions, isLoadingCompanyVersions } =
    useAppSelector(selectInfoPage);

  const data = [
    {
      name: '5S Control version',
      version: '0.0.7',
    },
    {
      name: '5S Control version',
      version: '0.0.7',
    },
    {
      name: '5S Control version',
      version: '0.0.7',
    },
    {
      name: '5S Control version',
      version: '0.0.7',
    },
  ];

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

      <p className={styles.title}>Algorithms versions</p>

      <div className={styles.algorithms}>
        {version.map((elem, index) => (
          <p key={index} className={styles.algorithms_row}>
            {/* <span className={styles.algorithms_row_title}>{name}: </span> */}
            {elem}
          </p>
        ))}
      </div>
    </WrapperPage>
  );
};

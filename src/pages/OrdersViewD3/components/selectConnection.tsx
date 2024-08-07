import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getConnectionsToDB, selectConnectionPage } from '../../configuration/connectionSlice';
import styles from '../style.module.scss';
import { patchStatusData } from '../../../api/orderView';
import { useEffect } from 'react';

export const SelectConnection = ({ closeFilter }: { closeFilter: () => void }) => {
  const { databases } = useAppSelector(selectConnectionPage);
  const [cookies] = useCookies(['token']);
  const dispatch = useAppDispatch();

  const results = [...(databases?.results || [])].sort((a, b) => a.id - b.id);

  const changeActiveConnection = (id: number) => {
    patchStatusData(id, cookies.token, { is_active: true }).then(() => {
      // closeFilter();
      dispatch(
        getConnectionsToDB({
          token: cookies.token,
          hostname: window.location.hostname,
        })
      );
    });
  };

  return (
    <div className={styles.select}>
      {results.map((connection) => (
        <span
          key={connection.id}
          className={connection.is_active ? styles.select__active : styles.select__noActive}
          onClick={() => changeActiveConnection(connection.id)}
        >
          {connection.erp_system}
        </span>
      ))}
    </div>
  );
};

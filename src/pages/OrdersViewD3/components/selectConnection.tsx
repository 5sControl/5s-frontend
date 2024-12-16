import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getConnectionsToDB, selectConnectionPage } from '../../configuration/connectionSlice';
import styles from '../style.module.scss';
import { patchStatusData } from '../../../api/orderView';

type Props = {
  changeHandler: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SelectConnection = ({ changeHandler }: Props) => {
  const { databases } = useAppSelector(selectConnectionPage);
  const [cookies] = useCookies(['token']);
  const dispatch = useAppDispatch();

  const results = [...(databases?.results || [])].sort((a, b) => a.id - b.id);

  const changeActiveConnection = (id: number) => {
    patchStatusData(id, cookies.token, { used_in_orders_view: true }).then(() => {
      dispatch(
        getConnectionsToDB({
          token: cookies.token,
          hostname: window.location.hostname,
        })
      );
      changeHandler((prev) => !prev);
    });
  };

  return (
    <div className={styles.select}>
      {results.map((connection) => (
        <span
          key={connection.id}
          className={connection.used_in_orders_view ? styles.select__active : styles.select__noActive}
          onClick={() => changeActiveConnection(connection.id)}
        >
          {connection.erp_system}
        </span>
      ))}
    </div>
  );
};

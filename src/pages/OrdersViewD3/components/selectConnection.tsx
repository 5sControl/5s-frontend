import { useCookies } from 'react-cookie';
import { useAppSelector } from '../../../store/hooks';
import { selectConnectionPage } from '../../configuration/connectionSlice';
import styles from '../style.module.scss';
import { patchStatusData } from '../../../api/orderView';

export const SelectConnection = ({ closeFilter }: { closeFilter: () => void }) => {
  const { databases } = useAppSelector(selectConnectionPage);
  const [cookies] = useCookies(['token']);

  const changeActiveConnection = (id: number) => {
    patchStatusData(id, cookies.token, { is_active: true }).then(() => {
      // setDefaultBaseType(type);
      closeFilter();
    });
  };

  return (
    <div className={styles.select}>
      {databases?.results.map((connection) => (
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

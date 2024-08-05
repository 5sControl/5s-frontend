import { useAppSelector } from '../../../store/hooks';
import { selectConnectionPage } from '../../configuration/connectionSlice';
import styles from '../style.module.scss';

export const SelectConnection = () => {
  const { databases } = useAppSelector(selectConnectionPage);

  return (
    <div className={styles.select}>
      <span
      // className={defaultBaseType === 'database' ? styles.select__active : styles.select__noActive}
      // onClick={() => changeSelectType('database')}
      >
        Winkhaus
      </span>
      <span
      // className={defaultBaseType === 'api' ? styles.select__active : styles.select__noActive}
      // onClick={() => changeSelectType('api')}
      >
        Odoo
      </span>
    </div>
  );
};

import styles from './contacts.module.scss';
import { Delete } from '../../../assets/svg/SVGcomponent';

type PropsType = {
  deleteAction: () => void;
  hideList: () => void;
};

export const ActionList: React.FC<PropsType> = ({ deleteAction, hideList }) => {
  return (
    <div className={styles.settingsContainer} onMouseLeave={hideList}>
      <div className={styles.settingsMenu}>
        <div className={styles.settingsMenu_item} onClick={deleteAction}>
          <Delete />
          <p className={styles.settingsText}>Delete</p>
        </div>
      </div>
    </div>
  );
};

import { Button } from '../../../../components/button';
import styles from './licenseTab.module.scss';

export const LicenseTab: React.FC = () => {
  return (
    <div>
      <div className={styles.header}>
        <p className={styles.header_title}>License</p>

        <Button text="Upgrade Plan" />
      </div>

      <div className={styles.content}>
        <div className={styles.content_count}>
          <span className={styles.content_count_bold}>{'0/5'}&nbsp;</span>
          <span>algorithms used</span>
        </div>
      </div>
    </div>
  );
};

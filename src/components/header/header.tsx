import { LogoHorizontal } from '../../assets/svg/SVGcomponent';
import styles from './header.module.scss';

type PropsType = {
  children: React.ReactNode;
  title: string;
  isTabs?: boolean;
};

export const HeaderMain: React.FC<PropsType> = ({ children, title, isTabs }) => {
  return (
    <section className={styles.header}>
      <div className={styles.logo}>
        <LogoHorizontal className={styles.logo_svg} />
      </div>
      <div className={styles.content}>
        <h1>{title}</h1>
        <div className={`${styles.container} ${isTabs ? styles.isTabs : ''}`}>{children}</div>
      </div>
    </section>
  );
};

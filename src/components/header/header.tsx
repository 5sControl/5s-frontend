import { LogoHorizontal } from '../../assets/svg/SVGcomponent';
import styles from './header.module.scss';

type PropsType = {
  children?: React.ReactNode;
  title: string;
  noTabs?: boolean;
};

export const HeaderMain: React.FC<PropsType> = ({ children, title, noTabs }) => {
  return (
    <section className={styles.header}>
      <div className={styles.logo}>
        <LogoHorizontal className={styles.logo_svg} />
      </div>
      <div className={styles.content}>
        <h1>{title}</h1>
        <div className={`${styles.container} ${noTabs ? styles.noTabs : ''}`}>{children}</div>
      </div>
    </section>
  );
};

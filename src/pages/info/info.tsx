import React, { useState } from 'react';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { Version } from './version/version';
import styles from './info.module.scss';
import { Link } from 'react-router-dom';

export const Info: React.FC = () => {
  const [active, setActive] = useState<string>('version');
  return (
    <WrapperPage title="5S Control">
      <section className={styles.wrapper}>
        <div className={styles.tabs}>
          <Link
            to="/info/version"
            className={`${styles.tab} ${active === 'version' ? styles.active : styles.noActive}`}
            onClick={() => setActive('version')}
          >
            Info
          </Link>
          <Link
            to="/info/message"
            className={`${styles.tab} ${active === 'message' ? styles.active : styles.noActive}`}
            onClick={() => setActive('message')}
          >
            System messages
          </Link>
        </div>
        <main className={styles.main}>
          {active === 'version' && <Version />}
          {active === 'message' && <Version />}
        </main>
      </section>
    </WrapperPage>
  );
};

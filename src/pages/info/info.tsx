import React, { useState } from 'react';
import { Version } from './version/version';
import styles from './info.module.scss';
import { Link } from 'react-router-dom';
import { SystemMessage } from './messages/message';
import { HeaderMain } from '../../components/header';
import { Task } from './task/task';

export const Info: React.FC = () => {
  const [active, setActive] = useState<string>(
    window.location.href.includes('message') ? 'message' : 'version'
  );
  return (
    <>
      <HeaderMain title="5ControlS">
        <section className={styles.tabs}>
          <Link
            to="/info/version"
            className={`${styles.tab} ${active === 'version' ? styles.active : styles.noActive}`}
            onClick={() => setActive('version')}
          >
            <span>Info</span>
          </Link>
          <Link
            to="/info/message"
            className={`${styles.tab} ${active === 'message' ? styles.active : styles.noActive}`}
            onClick={() => setActive('message')}
          >
            <span>System messages</span>
          </Link>
          <Link
            to="/info/task"
            className={`${styles.tab} ${active === 'task' ? styles.active : styles.noActive}`}
            onClick={() => setActive('task')}
          >
            <span>Task manager</span>
          </Link>
        </section>
      </HeaderMain>
      <section className={styles.wrapper}>
        <main className={styles.main}>
          {active === 'version' && <Version />}
          {active === 'message' && <SystemMessage />}
          {active === 'task' && <Task />}
        </main>
      </section>
    </>
  );
};

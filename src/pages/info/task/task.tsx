import { useState } from 'react';
import styles from './styles.module.scss';
import { ProcessesComponent } from './processes/processes';

export const Task = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section className={styles.wrapper}>
      <ul className={styles.container}>
        <li
          onClick={() => setActiveTab(0)}
          className={`${styles.tab} ${activeTab === 0 ? styles.tab_active : styles.tab_nonActive}`}
        >
          Processes
        </li>
        <li
          //   onClick={() => setActiveTab(1)}
          className={`${styles.tab} ${activeTab === 1 ? styles.tab_active : styles.tab_nonActive}`}
        >
          System check
        </li>
        <li className={styles.container_underline}></li>
      </ul>
      {activeTab === 0 && <ProcessesComponent />}
    </section>
  );
};

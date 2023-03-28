import React from 'react';
import styles from './wrapperPage.module.scss';

type PropsType = {
  children: React.ReactNode;
  title?: string;
};

export const WrapperPage: React.FC<PropsType> = ({ title, children }) => {
  return (
    <div className={styles.wrapper}>
      {title ? (
        <div className={styles.header}>
          <h2 className={styles.header_title}>{title}</h2>
        </div>
      ) : null}

      {children}
    </div>
  );
};

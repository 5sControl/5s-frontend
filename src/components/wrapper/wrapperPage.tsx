import React from 'react';
import styles from './wrapperPage.module.scss';

type PropsType = {
  children: React.ReactNode;
};

export const WrapperPage: React.FC<PropsType> = ({ children }) => {
  return <section className={styles.wrapper}>{children}</section>;
};

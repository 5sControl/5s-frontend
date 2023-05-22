import React from 'react';
import styles from './notification.module.scss';
import { Cross, NotificationBad } from '../../assets/svg/SVGcomponent';

type PropsType = {
  message: string;
  close: () => void;
};

export const NotificationSocket: React.FC<PropsType> = ({ message, close }) => {
  return (
    <div className={`${styles.container} ${styles.bad}`}>
      <div className={styles.text}>
        <NotificationBad />
        <span>{message}</span>
      </div>

      <Cross onClick={close} className={styles.cross} />
    </div>
  );
};

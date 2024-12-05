import React from 'react';
import styles from './notification.module.scss';
import { NotificationBad, NotificationGood } from '../../assets/svg/SVGcomponent';

type PropsType = {
  status: boolean;
  message: string;
  isLil?: boolean;
};

export const Notification: React.FC<PropsType> = ({ status, message, isLil }) => {
  return (
    <div
      className={`${isLil ? styles.containerLil : styles.container} ${
        status ? styles.good : styles.bad
      }`}
    >
      {status ? <NotificationGood /> : <NotificationBad />}
      <span>{message}</span>
    </div>
  );
};

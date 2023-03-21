import React from 'react';
import styles from './button.module.scss';
import { Plus } from '../../assets/svg/SVGcomponent';

type PropsType = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  isIcon?: boolean;
  onClick?: () => void;
};

export const Button: React.FC<PropsType> = ({ className, type, text, isIcon, onClick }) => {
  return (
    <button type={type} className={`${styles.button} ${className}`} onClick={onClick}>
      {isIcon && <Plus className={styles.icon} />}
      <span>{text}</span>
    </button>
  );
};

import React from 'react';
import styles from './button.module.scss';
import { Plus } from '../../assets/svg/SVGcomponent';

type PropsType = {
  text: string;
  variant?: 'contained' | 'outlined';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  isIcon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button: React.FC<PropsType> = ({
  variant = 'contained',
  className,
  type = 'button',
  text,
  isIcon,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`${styles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {isIcon && <Plus className={styles[`${variant}_icon`]} />}
      <span>{text}</span>
    </button>
  );
};

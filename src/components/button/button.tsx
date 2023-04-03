import React from 'react';
import styles from './button.module.scss';

type PropsType = {
  text?: string;
  variant?: 'contained' | 'outlined' | 'text' | 'oval';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  IconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
  IconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
};

export const Button: React.FC<PropsType> = ({
  variant = 'contained',
  className,
  type = 'button',
  text,
  disabled = false,
  onClick,
  IconLeft,
  IconRight,
  iconColor,
}) => {
  return (
    <button
      type={type}
      className={`${styles[variant]} ${text ? styles.gap : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {IconLeft && <IconLeft className={styles[`${variant}_icon`]} color={iconColor} />}
      <span>{text}</span>
      {IconRight && <IconRight className={styles[`${variant}_icon`]} color={iconColor} />}
    </button>
  );
};

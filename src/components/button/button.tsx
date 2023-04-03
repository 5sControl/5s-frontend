/* eslint-disable react/no-children-prop */
import React from 'react';
import styles from './button.module.scss';

type PropsType = {
  text?: string;
  variant?: 'contained' | 'outlined' | 'text' | 'oval';
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  IconLeft?: React.FC<React.SVGProps<SVGSVGElement>>;
  IconRight?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  className?: string;
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
  href,
}) => {
  return React.createElement(
    href ? 'a' : 'button',
    {
      type,
      className: `${styles[variant]} ${text ? styles.gap : ''} ${className}`,
      disabled: disabled,
      onClick: onClick,
      href,
    },
    [
      IconLeft &&
        React.createElement(IconLeft, {
          className: styles[`${variant}_icon`],
          color: iconColor,
        }),
      React.createElement('span', {
        children: text,
      }),
      IconRight &&
        React.createElement(IconRight, {
          className: styles[`${variant}_icon`],
          color: iconColor,
        }),
    ]
  );
};

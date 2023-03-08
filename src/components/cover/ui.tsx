import styles from './styles.module.scss';

type PropsType = {
  children: React.ReactNode;
  className?: string;
};

export const Cover: React.FC<PropsType> = ({ children, className }) => {
  return <div className={`${styles.cover} ${className}`}>{children}</div>;
};

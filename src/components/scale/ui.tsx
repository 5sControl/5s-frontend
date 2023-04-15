import styles from './scale.module.scss';
import { ReactComponent as ScaleSVG } from './scale.svg';
type PropsType = {
  className?: string;
  onClick: () => void;
};

export const Scale: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <ScaleSVG />
    </div>
  );
};

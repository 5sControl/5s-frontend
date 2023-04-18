import styles from './scale.module.scss';
import { AiOutlineFullscreen } from 'react-icons/ai';
type PropsType = {
  className?: string;
  onClick: () => void;
};

export const Scale: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <AiOutlineFullscreen style={{ color: 'white' }} />
    </div>
  );
};

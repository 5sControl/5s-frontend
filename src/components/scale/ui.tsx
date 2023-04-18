import styles from './scale.module.scss';
import { MdOutlineFullscreen } from 'react-icons/md';
type PropsType = {
  className?: string;
  onClick: () => void;
};

export const Scale: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <MdOutlineFullscreen style={{ color: 'white', width: '25px', height: '25px' }} />
    </div>
  );
};

import styles from './scale.module.scss';
import { MdOutlineFullscreenExit } from 'react-icons/md';
type PropsType = {
  className?: string;
  onClick: () => void;
};

const ZoomOut: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <MdOutlineFullscreenExit style={{ color: 'white', width: '25px', height: '25px' }} />
    </div>
  );
};

export default ZoomOut;
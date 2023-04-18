import styles from './scale.module.scss';
import { AiOutlineFullscreenExit } from 'react-icons/ai';
type PropsType = {
  className?: string;
  onClick: () => void;
};

export const ZoomOut: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <AiOutlineFullscreenExit style={{ color: 'white' }} />
    </div>
  );
};

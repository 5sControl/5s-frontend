import styles from './close.module.scss';
import { AiOutlineClose } from 'react-icons/ai';
type PropsType = {
  className?: string;
  onClick: () => void;
};

export const Сlosing: React.FC<PropsType> = ({ className, onClick }) => {
  return (
    <div className={`${styles.cover} ${className}`} onClick={onClick}>
      <AiOutlineClose />
    </div>
  );
};

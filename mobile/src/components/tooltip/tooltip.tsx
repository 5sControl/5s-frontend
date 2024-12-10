import { useRef, useState } from 'react';
import { Tooltip } from '../../assets/svg/SVGcomponent';
import { useOutsideClick } from '../../utils/useOutsideClick'; 

import styles from './tooltip.module.scss';

type PropsType = {
  title?: string;
  text: string;
};

export const TooltipCustom: React.FC<PropsType> = ({ title, text }): JSX.Element => {
  const refTooltip = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOutsideClick(refTooltip, () => openHandler());

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <span className={styles.tooltip}>
      <img src={Tooltip} className={styles.icon} onClick={openHandler} />
      {isOpen && (
        <div className={styles.container} ref={refTooltip}>
          {title && <h1 className={styles.title}>{title}</h1>}
          <p className={styles.text}>{text}</p>
        </div>
      )}
    </span>
  );
};

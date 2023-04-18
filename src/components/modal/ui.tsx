import { useEffect } from 'react';
import { Cross } from '../../assets/svg/SVGcomponent';
import { ReactPortal } from '../reactPortal';
import './modal.scss';

type PropsType = {
  isOpen: boolean;
  children: React.ReactNode;
  handleClose: () => void;
  className?: string;
  showCross?: boolean;
  showSubstrateCross?: boolean;
};

export const Modal: React.FC<PropsType> = ({
  children,
  handleClose,
  isOpen,
  className,
  showCross = false,
  showSubstrateCross = false,
}) => {
  // useEffect(() => {
  //   const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? handleClose() : null);
  //   document.body.addEventListener('keydown', closeOnEscapeKey);
  //   return () => {
  //     document.body.removeEventListener('keydown', closeOnEscapeKey);
  //   };
  // }, [handleClose]);

  if (!isOpen) return null;

  const handleClickToBg = (event: React.MouseEvent) => {
    const { id } = event.target as HTMLDivElement;

    if (id === 'modal-bg') {
      handleClose();
    }
  };

  return (
    <ReactPortal wrapperId="modal-container">
      <div id="modal-bg" className="modal" onClick={handleClickToBg}>
        <div className={`modal-content ${className}`}>
          {showCross && (
            <Cross
              className={`modal-cross ${showSubstrateCross ? 'modal-cross_substrate' : ''}`}
              onClick={handleClose}
            />
          )}
          {children}
        </div>
      </div>
    </ReactPortal>
  );
};

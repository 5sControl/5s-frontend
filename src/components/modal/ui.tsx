import { useEffect } from 'react';
import { ReactPortal } from '../reactPortal';
import './modal.scss';

type PropsType = {
  isOpen: boolean;
  children: React.ReactNode;
  handleClose: () => void;
  className?: string;
};

export const Modal: React.FC<PropsType> = ({ children, handleClose, isOpen, className }) => {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? handleClose() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

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
        <div className={`modal-content ${className}`}>{children}</div>
      </div>
    </ReactPortal>
  );
};

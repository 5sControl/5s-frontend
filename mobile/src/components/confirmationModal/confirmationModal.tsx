import React from "react";
import { IonButton, IonModal } from "@ionic/react";
import "./ConfirmationModal.scss";

type ConfirmationModalProps = {
  type: "primary" | "danger";
  isOpen: boolean;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  cancelText: string;
  onCancel?: () => void;
  onClose?: () => void;
  onDismiss?: () => void;
  description?: string;
  preventDismiss?: boolean;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDismiss,
  onCancel,
  onConfirm,
  title,
  type,
  confirmText,
  cancelText,
  description,
  preventDismiss = false,
}) => {

  const handleDismiss = () => {
    if (!preventDismiss && onDismiss) {
      onDismiss();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleDismiss} initialBreakpoint={1} breakpoints={[0, 1]}>
      <div className="block ion-padding">
        <h5 className="ion-text-center">{title}</h5>
        {description && <p className="modal__description ion-text-center">{description}</p>}
        <IonButton expand="full" size="small" color={type} className="modal__button" onClick={() => onConfirm()}>
          {confirmText}
        </IonButton>
        <IonButton
          expand="full"
          size="small"
          fill="outline"
          className="modal__button outlined"
          shape="round"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          {cancelText}
        </IonButton>
      </div>
    </IonModal>
  );
};

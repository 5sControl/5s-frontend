import React from "react";
import { IonButton, IonModal } from "@ionic/react";
import "./ConfirmationModal.scss";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  cancelText: string;
  description?: string;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
  description,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <div className="block ion-padding">
        <h5 className="ion-text-center">{title}</h5>
        {description && <p className="modal__description ion-text-center">{description}</p>}
        <IonButton expand="full" size="small" color="danger" className="modal__button" onClick={onConfirm}>
          {confirmText}
        </IonButton>
        <IonButton
          expand="full"
          size="small"
          fill="outline"
          className="modal__button outlined"
          shape="round"
          onClick={onClose}
        >
          {cancelText}
        </IonButton>
      </div>
    </IonModal>
  );
};
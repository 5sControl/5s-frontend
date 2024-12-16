import React, { useEffect, useState } from "react";
import { IonButton, IonLabel, IonList, IonModal } from "@ionic/react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
const ModalSave = ({ isModalOpen, setIsModalOpen, handleSubmit }: IModal) => {
  const { t } = useTranslation();
  return (
    <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
      <IonList className={styles.list}>
        <IonLabel className={styles.label}>{t("operations.saveChanges")}?</IonLabel>
        <IonList className={styles.list} class="ion-padding">
          <IonButton onClick={handleSubmit}>{t("operations.save")}</IonButton>
          <IonButton color="danger" fill="outline" onClick={() => setIsModalOpen(false)}>
            {t("operations.cancel")}
          </IonButton>
        </IonList>
      </IonList>
    </IonModal>
  );
};

interface IModal {
  isModalOpen: boolean;
  handleSubmit: () => void;
  setIsModalOpen: (v: boolean) => void;
}

export default ModalSave;

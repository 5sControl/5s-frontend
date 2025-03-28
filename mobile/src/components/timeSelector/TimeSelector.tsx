import { IonButton, IonDatetime, IonModal } from "@ionic/react";
import { RefObject, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./timeSelector.module.css";

type TimeSelectorProps = {
  time: string;
  modalRef: RefObject<HTMLIonModalElement>;
  setTime: (time: string) => void;
  setSave?: (save: boolean) => void;
};

const TimeSelector = ({ time, modalRef, setTime, setSave }: TimeSelectorProps) => {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState<string>(time);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleTimeClick = () => {
    setModalOpen(true);
    modalRef.current?.present();
  };

  const handleSave = () => {
    setTime(selectedTime);
    if (setSave) setSave(false);
    modalRef.current?.dismiss();
  };

  const handleCancel = () => {
    setSelectedTime(time);
    setModalOpen(false);
    modalRef.current?.dismiss();
  };

  return (
    <>
      <IonButton
        size="small"
        fill="outline"
        className={`${!isModalOpen && "outlined"} ${styles.button}`}
        onClick={handleTimeClick}
      >
        {time}
      </IonButton>

      <IonModal ref={modalRef} onWillDismiss={handleCancel}>
        <IonDatetime
          presentation="time"
          value={selectedTime}
          onIonChange={(e) => setSelectedTime(e.detail.value as string)}
        />
        <IonButton onClick={handleSave} style={{ margin: ".5rem", marginBottom: 0 }}>
          {t("operations.save")}
        </IonButton>
        <IonButton color="danger" style={{ margin: ".5rem" }} fill="outline" onClick={handleCancel}>
          {t("operations.cancel")}
        </IonButton>{" "}
      </IonModal>
    </>
  );
};
export default TimeSelector;

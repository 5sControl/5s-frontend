import { RefObject, useEffect, useState } from "react";
import { IonButton, IonDatetime, IonModal, IonList, IonLabel } from "@ionic/react";
import { formatDate } from "../../utils/parseInputDate";
import { useTranslation } from "react-i18next";
import InputDate from "../inputs/inputDate/inputDate";

type DataSelectorProps = {
  label: string;
  date: string;
  setDate: (date: string) => void;
  modalRef: RefObject<HTMLIonModalElement>;
  setSave?: (save: boolean) => void;
  minDate?: string;
  maxDate?: string;
  time?: boolean;
};

const DateSelector = ({ label, date, modalRef, setSave, maxDate, minDate, time, setDate }: DataSelectorProps) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(date);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  const handleDateClick = () => {
    modalRef.current?.present();
    setModalOpen(true);
  };

  const handleSave = () => {
    setDate(selectedDate);
    if (setSave) setSave(false);
    modalRef.current?.dismiss();
  };

  const handleCancel = () => {
    setSelectedDate(date);
    setModalOpen(false);
    modalRef.current?.dismiss();
  };

  return (
    <div>
      <IonList inset={true}>
        <IonLabel className="text-bold">{label}</IonLabel>
        <InputDate value={date ? formatDate(date) : ""} isOpen={isModalOpen} onClick={handleDateClick} />
      </IonList>

      <IonModal ref={modalRef} onWillDismiss={handleCancel}>
        <IonDatetime
          presentation={time ? "time" : "date"}
          value={selectedDate}
          onIonChange={e => setSelectedDate(e.detail.value as string)}
          locale={t("lang")}
          min={minDate}
          max={maxDate}
        />
        <IonButton onClick={handleSave} style={{ margin: ".5rem", marginBottom: 0 }}>
          {t("operations.save")}
        </IonButton>
        <IonButton style={{ margin: ".5rem" }} color="danger" fill="outline" onClick={handleCancel}>
          {t("operations.cancel")}
        </IonButton>
      </IonModal>
    </div>
  );
};

export default DateSelector;

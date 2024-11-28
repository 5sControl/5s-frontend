import { RefObject, useState } from "react";
import { IonButton, IonDatetime, IonModal, IonList, IonLabel } from "@ionic/react";
import { formatDate } from "../../utils/parseInputDate";
import { useTranslation } from "react-i18next";
import InputDate from "../inputs/inputDate/inputDate";

type DataSelectorProps = {
  label: string;
  date: string;
  setDate: (date: string) => void;
  modalRef: RefObject<HTMLIonModalElement>;
  minDate?: string;
  maxDate?: string;
};

const DateSelector = ({ label, date, modalRef, maxDate, minDate, setDate }: DataSelectorProps) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(date);
  const [isModalOpen, setModalOpen] = useState<boolean>();

  const handleDateClick = () => {
    modalRef.current?.present();
    setModalOpen(true);
  };

  const handleSave = () => {
    setDate(selectedDate);
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
        <InputDate value={formatDate(date)} isOpen={isModalOpen} onClick={handleDateClick} />
      </IonList>

      <IonModal ref={modalRef} onWillDismiss={handleCancel}>
        <IonDatetime
          presentation="date"
          value={selectedDate}
          onIonChange={e => setSelectedDate(e.detail.value as string)}
          min={minDate}
          max={maxDate}
        />
        <IonButton onClick={handleSave}>{t("operations.save")}</IonButton>
        <IonButton color="danger" fill="outline" onClick={handleCancel}>
          {t("operations.cancel")}
        </IonButton>{" "}
      </IonModal>
    </div>
  );
};

export default DateSelector;

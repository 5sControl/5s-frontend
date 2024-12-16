import { IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonModal } from "@ionic/react";
import { useTranslation } from "react-i18next";

export const TimePicker = () => {
  const { t } = useTranslation();
  return (
    <div>
      <IonItem className="input__field">
        <IonLabel>{t("text.time")}</IonLabel>
        <IonDatetimeButton datetime="time"></IonDatetimeButton>
      </IonItem>
      <IonModal keepContentsMounted={true}>
        <IonDatetime presentation="time" id="time"></IonDatetime>
      </IonModal>
    </div>
  );
};

export default TimePicker;

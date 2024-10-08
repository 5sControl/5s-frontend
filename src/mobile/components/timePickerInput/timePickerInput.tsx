import React from "react";
import { IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonModal } from "@ionic/react";

export const TimePicker = () => {

  return (
    <div>
        <IonItem className="input__field">
            <IonLabel>Planned Time</IonLabel>
            <IonDatetimeButton datetime="time"></IonDatetimeButton>
        </IonItem>
        <IonModal keepContentsMounted={true}>
            <IonDatetime presentation="time" id="time"></IonDatetime>
        </IonModal>
    </div>
  );
};

export default TimePicker;
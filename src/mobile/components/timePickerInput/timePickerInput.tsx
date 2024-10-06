import React, { useState } from 'react';
import { IonDatetime, IonDatetimeButton, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';

export const TimePicker = () => {
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (e: any) => {
    setSelectedTime(e.detail.value);
    setShowTimePicker(!showTimePicker);
  };

  const handleInputChange = (e: any) => {
    setSelectedTime(e.target.value);
    setShowTimePicker(true); 
  };

  const openTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  }

  return (
    <div>
        <IonItem className='input__field'>
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
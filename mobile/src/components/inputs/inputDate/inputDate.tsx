import { IonIcon, IonLabel } from "@ionic/react";
import DateIcon from "../../../assets/svg/calendar.svg";
import style from "./style.module.scss";

interface IInputDate {
  value: string;
  isOpen?: boolean;
  onClick: () => void;
}

const InputDate = ({ value, isOpen, onClick }: IInputDate) => {
  return (
    <div className={`${style.date} ${isOpen && style.active}`} onClick={onClick}>
      <IonLabel>{value}</IonLabel>
      <IonIcon icon={DateIcon}></IonIcon>
    </div>
  );
};

export default InputDate;

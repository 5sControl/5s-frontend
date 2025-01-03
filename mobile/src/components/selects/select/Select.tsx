import { IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import "./Select.scss";
import { SelectItem } from "../../../models/types/selectItem";

type SelectProps = {
  value: string;
  label?: string;
  placeholder: string;
  selectList: SelectItem[];
  handleChange: (e: any) => void;
};

const Select = ({ label, placeholder, selectList, value, handleChange }: SelectProps) => {
  return (
    <div className="select__wrapper">
      <IonLabel className="select__label label label__bold">{label}</IonLabel>
      <IonSelect
        onIonChange={handleChange}
        value={value}
        labelPlacement="stacked"
        interface="popover"
        placeholder={placeholder}
        className="select"
      >
        {selectList.map(({ label, value }) => (
          <IonSelectOption key={value} value={value}>
            {label}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};
export default Select;

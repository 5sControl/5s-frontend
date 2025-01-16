import { IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import "./Select.scss";
import { SelectItem } from "../../../models/types/selectItem";
import { useTranslation } from "react-i18next";

type SelectProps = {
  value: string;
  label?: string;
  placeholder: string;
  selectList: SelectItem[];
  handleChange: (e: any) => void;
  handleFocus?: () => void;
  isLoading?: boolean;
};

const Select = ({ label, placeholder, selectList, value, handleChange, handleFocus, isLoading}: SelectProps) => {
  const {t} = useTranslation();

  return (
    <div className="select__wrapper">
      <IonLabel className="select__label label label__bold">{label}</IonLabel>
      <IonSelect
        onIonChange={handleChange}
        onIonFocus={handleFocus}
        value={value}
        labelPlacement="stacked"
        interface="popover"
        placeholder={placeholder}
        className="select"
      >

        {isLoading ? 
          <IonSelectOption disabled>{t("messages.loading")}...</IonSelectOption> 
          : (selectList.length > 0 ? selectList.map(({ label, value }) => (
          <IonSelectOption key={value} value={value}>
            {label}
          </IonSelectOption>)) 
          : <IonSelectOption disabled>{t("messages.noData")}</IonSelectOption>)
        }
      </IonSelect>
    </div>
  );
};
export default Select;

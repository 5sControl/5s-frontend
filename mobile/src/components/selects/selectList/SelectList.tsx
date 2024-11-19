import { IonItem, IonList, IonRadio, IonRadioGroup } from "@ionic/react";
import { SelectItem } from "../../../models/types/selectItem";

type SelectListProps = {
  value: string;
  selectList: SelectItem[];
  handleChange: (e: any) => void;
};

const SelectList = ({ value, selectList, handleChange }: SelectListProps) => {
  return (
    <IonList inset={true}>
      <IonRadioGroup value={value} onIonChange={handleChange}>
        {selectList.map(({ label, value }) => (
          <IonItem key={value}>
            <IonRadio value={value}>{label}</IonRadio>
          </IonItem>
        ))}
      </IonRadioGroup>
    </IonList>
  );
};
export default SelectList;

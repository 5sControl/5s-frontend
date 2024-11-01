import { IonInput, IonItem, IonLabel } from "@ionic/react";
import "./ReadOnlyInput.scss";

type ReadOnlyInputProps = {
  label: string;
  value: string;
};

const ReadOnlyInput = ({ label, value }: ReadOnlyInputProps) => {
  return (
    <IonItem className="input__field">
      <div className="input__readonly">
        <IonLabel className="input__label">{label}</IonLabel>
        <IonInput className="input__value" readonly value={value} />
      </div>
    </IonItem>
  );
};
export default ReadOnlyInput;

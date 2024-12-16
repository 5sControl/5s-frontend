import { IonInput, IonItem, IonLabel } from "@ionic/react";
import "./inputReadonly.scss";

type InputReadonlyProps = {
  label: string;
  value?: string;
};

const InputReadonly = ({ label, value }: InputReadonlyProps) => {
  return (
    <IonItem className="input__field">
      <div className="input__readonly">
        <IonLabel className="input__label">{label}</IonLabel>
        {value && <IonInput className="input__value" readonly value={value} />}
      </div>
    </IonItem>
  );
};
export default InputReadonly;

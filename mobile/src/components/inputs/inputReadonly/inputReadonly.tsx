import { IonItem, IonLabel } from "@ionic/react";
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
        {value && (
          <IonLabel className="input__value" title={value}>
            {value}
          </IonLabel>
        )}
      </div>
    </IonItem>
  );
};
export default InputReadonly;

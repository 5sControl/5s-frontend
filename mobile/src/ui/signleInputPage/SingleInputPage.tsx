import { IonButton, IonContent, IonInput, IonLabel, IonToast } from "@ionic/react";
import { Header } from "../../components/header/Header";
import "./SingleInputPage.scss";
import { ReactNode } from "react";

type SingleInputPageProps = {
  title?: ReactNode;
  backHref?: string;
  label: string;
  value: string;
  required: boolean;
  toastMessage?: string;
  placeholder?: string;
  handleChange: (e: any) => void;
  handleSave: () => void;
};

const SingleInputPage = ({
  title,
  backHref,
  label,
  value,
  placeholder,
  required,
  toastMessage,
  handleChange,
  handleSave,
}: SingleInputPageProps) => {
  return (
    <>
      <div className="input__container">
        <IonLabel position="stacked">{label}</IonLabel>
        <IonInput
          value={value}
          placeholder={placeholder}
          className="input__wrapper"
          onIonInput={handleChange}
          required={required}
        ></IonInput>
      </div>

      <IonButton className="bottom-50" expand="full" id="open-toast" onClick={handleSave} disabled={!value.trim()}>
        Save
      </IonButton>

      {value.trim().length === 0 && <IonToast trigger="open-toast" message={"Empty Input"} duration={3000} />}
    </>
  );
};
export default SingleInputPage;
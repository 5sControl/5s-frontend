import { IonButton, IonContent, IonInput, IonLabel } from "@ionic/react";
import { Header } from "../../components/header/Header";
import "./SingleInputPage.scss";
import { ReactNode } from "react";

type SingleInputPageProps = {
  title: ReactNode;
  backHref?: string;
  label: string;
  value: string;
  required: boolean;
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
  handleChange,
  handleSave,
}: SingleInputPageProps) => {
  return (
    <IonContent>
      <Header title={title} backButtonHref={backHref} />

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

      <IonButton className="bottom-50" expand="full" onClick={handleSave}>
        Save
      </IonButton>
    </IonContent>
  );
};
export default SingleInputPage;

import { IonItem, IonLabel, IonInput, IonInputPasswordToggle } from "@ionic/react";
import React from "react";

type InputProps = {
  label: string;
  value: string;
  required: boolean;
  handleChange: (e: any) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  onKeyDown?: (e: any) => void;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  required,
  handleChange,
  placeholder,
  onKeyDown,
  type = "text",
}) => {
  return (
    <IonItem className="input__field">
      <IonLabel position="stacked" style={{ marginBottom: ".5rem" }}>
        {label}
      </IonLabel>
      <IonInput
        value={value}
        placeholder={placeholder}
        className="input__wrapper"
        onIonInput={handleChange}
        required={required}
        onKeyDown={onKeyDown}
        type={type}
      >
        {type === "password" && <IonInputPasswordToggle slot="end" color="medium"></IonInputPasswordToggle>}
      </IonInput>
    </IonItem>
  );
};

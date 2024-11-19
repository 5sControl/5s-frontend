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
  state?: "error" | "active" | "neutral";
  errorMessage?: string;
  description?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  required,
  handleChange,
  placeholder,
  onKeyDown,
  type = "text",
  state = "neutral",
  errorMessage,
  description,
}) => {
  return (
    <IonItem className="input__field">
      <IonLabel style={{ marginBottom: ".5rem", fontWeight: 600, width: "100%" }}>
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

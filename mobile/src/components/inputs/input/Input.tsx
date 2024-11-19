import { IonItem, IonLabel, IonInput, IonInputPasswordToggle } from "@ionic/react";
import React, { useState } from "react";
import styles from "./input.module.scss";

type InputProps = {
  label: string;
  value: string;
  required: boolean;
  handleChange: (e: any) => void;
  placeholder?: string;
  bold?: boolean;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  onKeyDown?: (e: any) => void;
  state?: "error" | "neutral";
  errorMessage?: string;
  description?: string;
  hint?: string;
  disabled?: boolean;
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  required,
  handleChange,
  placeholder,
  onKeyDown,
  bold = true,
  type = "text",
  state = "neutral",
  disabled,
  hint,
  errorMessage,
  description,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <IonItem className="input__field">
      <IonLabel className={bold ? styles.label__bold : styles.label}>
        {label}
      </IonLabel>
      {description && (
        <IonLabel position="stacked" className={styles.description}>
          {description}
        </IonLabel>
      )}
      <IonInput
        value={value}
        placeholder={placeholder}
        className={`${styles.input} ${styles[state]} ${isFocused ? styles.focus : ""}`}
        onIonInput={handleChange}
        required={required}
        onKeyDown={onKeyDown}
        type={type}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {type === "password" && <IonInputPasswordToggle slot="end" color="medium"></IonInputPasswordToggle>}
      </IonInput>
      <div className={styles.footer}>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </IonItem>
  );
};

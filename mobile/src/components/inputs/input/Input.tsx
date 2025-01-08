import { IonItem, IonLabel, IonInput, IonInputPasswordToggle } from "@ionic/react";
import React, { useState } from "react";
import styles from "./input.module.scss";
import { TooltipCustom } from "../../tooltip/tooltip";

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
  maxLength?: number;
  hidePassword?: boolean;
  tooltip?: string;
  zIndex?: number;
  autocomplete?: "new-password" | "on" | "off" | undefined
};

export const Input: React.FC<InputProps> = ({
  label,
  value,
  required,
  placeholder,
  onKeyDown,
  handleChange,
  bold = true,
  type = "text",
  state = "neutral",
  hidePassword = false,
  errorMessage,
  description,
  maxLength,
  disabled,
  tooltip,
  hint,
  zIndex,
  autocomplete
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <IonItem className={`input__field ${tooltip ? styles.overflow : ""}`} style={{zIndex: zIndex}}>
      <IonLabel className={bold ? styles.label__bold : styles.label}>
        {label}
        {tooltip && <TooltipCustom title={label} text={tooltip} />}
      </IonLabel>
      {description && (
        <IonLabel position="stacked" className={styles.description}>
          {description}
        </IonLabel>
      )}
      <IonInput
        value={value}
        type={type}
        placeholder={placeholder}
        onIonInput={handleChange}
        required={required}
        onKeyDown={onKeyDown}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxlength={maxLength}
        className={`${styles.input} ${styles[state]} ${isFocused ? styles.focus : ""}`}
        autocomplete={autocomplete || "off"}
      >
        {type === "password" && !hidePassword && <IonInputPasswordToggle slot="end" color="medium" />}
      </IonInput>
      <div className={styles.footer}>
        {errorMessage && state === "error" && <p className={styles.errorMessage}>{errorMessage}</p>}
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </IonItem>
  );
};

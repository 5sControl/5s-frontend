import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../../../../components/inputs/input/Input";
import { IRecoverPasswordStepProps } from "../RecoverPassword";

const ResetPassword = ({ onPrevStep, onNextStep }: IRecoverPasswordStepProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  const onContinue = () => {
    setErrorMessage("");
    if (password.length < 4) {
      setErrorMessage(t("form.passwordLength"));
      return;
    }
    if (password != confirmPassword) {
        setErrorMessage(t("form.passwordsNotEqual"));
        return;
    }
    onNextStep();
  };

  return (
    <>
      <h1 className="step-title">{t("form.auth.enterPassword")}</h1>
      <Input
        type="password"
        placeholder={t("form.enterPassword")}
        value={password}
        label={t("users.newPassword")}
        required
        handleChange={handlePasswordChange}
        state={errorMessage ? "error" : "neutral"}
      />
      <Input
        type="password"
        placeholder={t("form.repeatPassword")}
        value={confirmPassword}
        label={t("users.confirmPassword")}
        required
        handleChange={handleConfirmPasswordChange}
        state={errorMessage ? "error" : "neutral"}
      />
      {errorMessage && <span className="error-message">{errorMessage}</span>}
      <div>
        <button className={"authorization__button"} onClick={onContinue} disabled={!password || !confirmPassword}>
          {t("form.auth.continue")}
        </button>
        <button className={"authorization__button secondary"} onClick={onPrevStep}>
          {t("form.auth.back")}
        </button>
      </div>
    </>
  );
};

export default ResetPassword;

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IRecoverPasswordStepProps } from "../RecoverPassword";
import { requestResetPassword, verifyCode } from "../../../../api/authorization";

const DIGITS = 6, CODE_TIMEOUT = 59;

const VerifyCode = ({ onPrevStep, onNextStep, setRecoverData, recoverData }: IRecoverPasswordStepProps) => {
  const { t, i18n } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [codeTimeout, setCodeTimeout] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [code, setCode] = useState("");

  const updateCode = () => {
    setCode(inputRefs.current.map(inputRef => inputRef?.value ?? "").join(""));
  }
  const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const inputLength = target.value.length;

    if (!inputLength || !/^\d$/.test(target.value)) {
      target.value = "";
      updateCode();
      return;
    }

    if (inputLength > 1) {
      const inputValues = target.value.split("");
      inputValues.forEach((value, valueIndex) => {
        const nextValueIndex = index + valueIndex;
        if (inputRefs.current[nextValueIndex]) {
          inputRefs.current[nextValueIndex].value = value;
        }
      });
    }

    const nextIndex = index + 1;
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
    updateCode();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const previousIndex = index - 1;
    const nextIndex = index + 1;

    switch (key) {
      case "ArrowLeft":
      case "ArrowUp":
        if (previousIndex >= 0) {
          inputRefs.current[previousIndex]?.focus();
        }
        event.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowDown":
        if (nextIndex < inputRefs.current.length) {
          inputRefs.current[nextIndex]?.focus();
        }
        event.preventDefault();
        break;
      case "Backspace":
        if (!event.currentTarget.value.length && inputRefs.current[previousIndex]) {
          inputRefs.current[previousIndex].value = "";
          inputRefs.current[previousIndex].focus();
        }
        break;
      default:
        break;
    }
    updateCode(); 
  };

  const startTimer = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const timerStart = new Date();
    setCodeTimeout(CODE_TIMEOUT);
    intervalId.current = setInterval(() => {
      const diff = CODE_TIMEOUT - Math.round((new Date().getTime() - timerStart.getTime()) / 1000);
      if (diff >= 0) {
        setCodeTimeout(diff);
      }
    }, 500);
  };
  const requestCode = () => {
    requestResetPassword(recoverData.email, i18n.language);
    startTimer();
  };

  useEffect(startTimer, []);

  const onContinue = () => {
    setErrorMessage("");
    verifyCode(recoverData.email, code)
      .then(() => {
        setRecoverData({ ...recoverData, code });
        onNextStep();
      })
      .catch(() => {
        setErrorMessage(t("form.auth.invalidCode"));
      });
  };

  return (
    <>
      <h1 className="step-title">{t("form.auth.enterCode")}</h1>
      <div className="code-inputs">
        {Array.from({ length: DIGITS }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={el => (inputRefs.current[index] = el)}
            onInput={event => handleInput(index, event)}
            onKeyDown={event => handleKeyDown(index, event)}
            data-number-code-input={index}
            className="code-input"
          />
        ))}
      </div>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
      {codeTimeout ? (
        <div className="code-timeout">
          {t("form.auth.requestANewCodeIn")} 00:{(codeTimeout < 10 ? "0" : "") + codeTimeout}
        </div>
      ) : (
        <button className="authorization__button outlined" onClick={requestCode}>
          {t("form.auth.requestCodeAgain")}
        </button>
      )}
      <div>
        <button className={"authorization__button"} onClick={onContinue} disabled={code.length != DIGITS}>
          {t("form.auth.continue")}
        </button>
        <button className={"authorization__button secondary"} onClick={onPrevStep}>
          {t("form.auth.back")}
        </button>
      </div>
    </>
  );
};

export default VerifyCode;

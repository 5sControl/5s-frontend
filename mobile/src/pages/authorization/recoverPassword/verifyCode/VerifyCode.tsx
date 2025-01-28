import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IRecoverPasswordStepProps } from "../RecoverPassword";

const DIGITS = 6, CODE_TIMEOUT = 59;

const VerifyCode = ({ onPrevStep, onNextStep, setRecoverData, recoverData }: IRecoverPasswordStepProps) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const [codeTimeout, setCodeTimeout] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const code = inputRefs.current.map(inputRef => inputRef?.value ?? "").join("");
  
  const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const inputLength = target.value.length;

    if (!inputLength || !/^\d$/.test(target.value)) {
      target.value = "";
      return;
    }

    if (inputLength > 1) {
      const inputValues = target.value.split("");
      inputValues.forEach((value, valueIndex) => {
        const nextValueIndex = index + valueIndex;
        console.log(value);
        if (inputRefs.current[nextValueIndex]) {
          inputRefs.current[nextValueIndex].value = value;
        }
      });
    }

    const nextIndex = index + 1;
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
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
  };

  const requestCode = () => {
    const timerStart = new Date();
    setCodeTimeout(CODE_TIMEOUT);
    const codeTimer = setInterval(() => {
      const diff = CODE_TIMEOUT - Math.round((new Date().getTime() - timerStart.getTime()) / 1000);
      if (diff >= 0) {
        setCodeTimeout(diff);
      }
    }, 500);
    return () => {
      clearInterval(codeTimer);
    };
  };

  useEffect(requestCode, []);

  const onContinue = () => {
    setErrorMessage("");
    setRecoverData({...recoverData, code});
    onNextStep();
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
        <div className="code-timeout">{t("form.auth.requestANewCodeIn")} 00:{codeTimeout}</div>
      ) : (
        <button className="authorization__button outlined" onClick={requestCode}>{t("form.auth.requestCodeAgain")}</button>
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

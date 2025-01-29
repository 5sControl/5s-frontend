import { useTranslation } from "react-i18next";
import { Input } from "../../../../components/inputs/input/Input";
import { useState } from "react";
import { IRecoverPasswordStepProps } from "../RecoverPassword";
import isValidEmail from "../../../../utils/isValidEmail";
import { requestResetPassword } from "../../../../api/authorization";

const RequestReset = ({onPrevStep, onNextStep, setRecoverData, recoverData}: IRecoverPasswordStepProps) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setRecoverData(({...recoverData, email: e.target.value}));
    }

    const onContinue = () => {
        setErrorMessage("");
        const { email } = recoverData;
        if (!email) {
            setErrorMessage(t("form.required"));
            return;
        }
        if (!isValidEmail(email)) {
            setErrorMessage(t("form.invalidEmail"));
            return;
        }
        requestResetPassword(email).then(onNextStep).catch(() => setErrorMessage(t("form.auth.emailNotFound")))
    }

    return <>
        <h1 className="step-title">{t("form.auth.enterEmail")}</h1>
        <Input placeholder="Email" value={recoverData.email} label={""} required handleChange={handleChange} state={errorMessage ? "error" : "neutral"}/>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
        <div>
            <button className={"authorization__button"} onClick={onContinue} disabled={!recoverData.email}>
            {t("form.auth.continue")}
            </button>
            <button className={"authorization__button secondary"} onClick={onPrevStep}>
            {t("form.auth.back")}
            </button>
        </div>  
    </>
}

export default RequestReset;
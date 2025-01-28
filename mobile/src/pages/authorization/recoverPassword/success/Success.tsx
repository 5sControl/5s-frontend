import { useTranslation } from "react-i18next";
import checkCircle from "../../../../assets/svg/checkCircle.svg";
import { useHistory } from "react-router";

const Success = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClick = () => {
    history.push("/");
  }
  
  return (
    <div className="success">
      <div className="success__content">
        <img src={checkCircle} />
        <h1>{t("form.auth.successful")}</h1>
        <p>{t("form.auth.passwordChanged")}</p>
        <button className="authorization__button outlined no-border" onClick={onClick}>{t("form.auth.continue")}</button>
      </div>
    </div>
  );
};

export default Success;

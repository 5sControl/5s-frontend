import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../shared/constants/routes";
import { useState } from "react";
import i18n, { changeI18Language } from "../../i18";
import SelectList from "../../components/selects/selectList/SelectList";

const Language = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    { label: "English", value: "en" },
    { label: "Русский", value: "ru" },
    { label: "Polski", value: "pl" },
  ];

  const handleLanguageChange = e => {
    setLanguage(e.detail.value);
    changeI18Language(e.detail.value);
  };

  return (
    <IonPage>
      <Header title={t("menu.language")} backButtonHref={ROUTES.MENU} />
      <IonContent>
        <SelectList selectList={languages} value={language} handleChange={handleLanguageChange} />
      </IonContent>
    </IonPage>
  );
};
export default Language;

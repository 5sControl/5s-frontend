import { IonContent, IonList, IonPage } from "@ionic/react";
import React from "react";
import { ROUTES } from "../../shared/constants/routes";
import { useHistory } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { ItemButton } from "../../components/itemButton/ItemButton";
import { useTranslation } from "react-i18next";
import MenuListButton from "../../components/menuListButton/MenuListButton";

const Configuration = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  return (
    <IonPage>
      <IonContent>
        {/* <Header title={t("config.title")} backButtonHref={ROUTES.MENU} /> */}
        <Header title={"Настройка данных"} backButtonHref={ROUTES.MENU} />
        {/* <IonList inset={true}>
          <ItemButton label={t("config.erp")} handleItemClick={() => handleItemClick(ROUTES.CONNECTIONS)} />
        </IonList> */}
        <IonList inset={true}>
          <MenuListButton
            title={"Универсальные справочники"}
            handleItemClick={() => handleItemClick(ROUTES.GENEREAL_DIRECTORIES)}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Configuration;

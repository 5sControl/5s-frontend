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
      <Header title={t("menu.dataConfiguration")} backButtonHref={ROUTES.MENU} />
      <IonContent>
        <IonList inset={true}>
          <MenuListButton
            title={t("menu.generalDirectories")}
            handleItemClick={() => handleItemClick(ROUTES.GENEREAL_DIRECTORIES)}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Configuration;

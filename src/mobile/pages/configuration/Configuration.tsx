import { IonContent, IonList } from "@ionic/react";
import React from "react";
import { ROUTES } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { ItemButton } from "../../components/itemButton/ItemButton";
import { useTranslation } from "react-i18next";
import MenuListButton from "../../components/menuListButton/MenuListButton";

const Configuration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <IonContent>
      <Header title={t("config.title")} backButtonHref={ROUTES.MENU} />
      <IonList inset={true}>
        <ItemButton label={t("config.erp")} handleItemClick={() => handleItemClick(ROUTES.CONNECTIONS)} />
      </IonList>
      <IonList inset={true}>
        <MenuListButton
          title={t("menu.generalDirectories")}
          handleItemClick={() => handleItemClick(ROUTES.GENEREAL_DIRECTORIES)}
        />
      </IonList>
    </IonContent>
  );
};

export default Configuration;

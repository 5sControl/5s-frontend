import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonIcon, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import { jwtDecode } from "jwt-decode";
import { getUserInfo, getUserList } from "../../api/getUserList";
import { ROUTES } from "../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import { ItemButton } from "../../components/itemButton/ItemButton";
import { Cog, DollarSign, MenuLogo, Orders, Settings } from "../../assets/svg/SVGcomponent";
import { Logout } from "../../components/logout/Logout";
import { useTranslation } from "react-i18next";
import { changeI18Language } from "../../i18";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import "./Menu.scss";
import Restricted from "../../providers/permissionProvider/Restricted";
import Select from "../../components/select/Select";

export const Menu: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<any>({});
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const selectList = [
    { label: "English", value: "en" },
    { label: "Русский", value: "ru" },
    { label: "Polski", value: "pl" },
  ];

  useEffect(() => {
    if (cookies.token) {
      const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
      getUserInfo(cookies.token)
        .then((response: any) => {
          if (response.data) {
            setUser(response.data);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user list:", error);
        });
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    changeI18Language(lang);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <IonPage>
      <Header
        title={
          <div className="main__header">
            <img src={MenuLogo} alt="Menu Logo" />
          </div>
        }
      />
      <IonContent color="light">

        <Logout username={user.username} logout={logout} />

        <Restricted to="view_order">
          <IonList inset={true}>
            <MenuListButton
              icon={DollarSign}
              title={t("menu.orders")}
              handleItemClick={() => handleItemClick(ROUTES.ORDERS)}
            />
            <MenuListButton icon={DollarSign} title={t("menu.reports")} />
          </IonList>
        </Restricted>

        <Restricted to="view_reference">
          <IonList inset={true}>
            {/* <MenuListButton title={t("menu.configuration")} handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)} />
          <MenuListButton title={t("menu.directories")} handleItemClick={() => handleItemClick(ROUTES.DIRECTORIES)} /> */}
            <MenuListButton
              title={t("menu.dataConfiguration")}
              handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)}
            />
            <MenuListButton title={t("menu.directories")} handleItemClick={() => handleItemClick(ROUTES.DIRECTORIES)} />
          </IonList>
        </Restricted>

        <Restricted to="proccess_qr_code_order_operation">
          <IonList inset={true}>
            <MenuListButton
              title={t("menu.scanner")}
              handleItemClick={() => handleItemClick(ROUTES.SCANNER_QR)}
            />
          </IonList>
        </Restricted>

        <Select
          value={language}
          placeholder={t("language")}
          handleChange={e => handleLanguageChange(e.detail.value)}
          selectList={selectList}
        />
        {/* {user && <Logout username={user.username} status={user.status} logout={logout} />} */}
      </IonContent>
    </IonPage>
  );
};

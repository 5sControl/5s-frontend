import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {IonContent, IonList, IonSelect, IonSelectOption} from "@ionic/react";
import jwtDecode from "jwt-decode";
import { getUserList } from "../../api/getUserList";
import { ROUTES } from "../../../shared/constants/routes";
import { Header } from "../../components/header/Header";
import { ItemButton } from "../../components/itemButton/ItemButton";
import { MenuLogo, Orders, Settings } from "../../assets/svg/SVGcomponent";
import { Logout } from "../../components/logout/Logout";
import { useTranslation } from 'react-i18next';

export const Menu: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    if (cookies.token) {
      const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
      getUserList(cookies.token).then((response: any) => {
        if (token.user_id && response.data) {
          setUser(response.data.find((user: any) => user.id === token.user_id));
        }
      });
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang); // Изменение языка
  };
  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const logout = () => {
    removeCookie("token", {path: "/"});
  };

  return (
    <IonContent color="light">
      <Header title={<img src={MenuLogo} alt="Menu Logo" />} />
      <IonList inset={true}>
        <ItemButton label={t('menu.ordersView')} icon={Settings} handleItemClick={() => handleItemClick(ROUTES.ORDERSVIEW)} />
        <ItemButton label={t('menu.configuration')} icon={Orders} handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)} />
        <IonSelect
            value={language}
            placeholder={t('language')}
            onIonChange={(e) => handleLanguageChange(e.detail.value)}
        >
          <IonSelectOption value="en">English</IonSelectOption>
          <IonSelectOption value="ru">Русский</IonSelectOption>
        </IonSelect>
      </IonList>
      {user && <Logout username={user.username} status={user.status} logout={logout} />}
    </IonContent>
  );
};

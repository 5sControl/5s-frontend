import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonIcon, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import { jwtDecode } from "jwt-decode";
import { getCurrentUserInfo, getUserList } from "../../api/users";
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
import Select from "../../components/selects/select/Select";
import { isMobile } from 'react-device-detect';

export const Menu: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState<any>({});
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (cookies.token) {
      const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
      getCurrentUserInfo(cookies.token)
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
              icon={Orders}
              title={t("menu.orders")}
              handleItemClick={() => handleItemClick(ROUTES.ORDERS)}
            />
            <MenuListButton
              icon={DollarSign}
              title={t("menu.reports")}
              handleItemClick={() => handleItemClick(ROUTES.REPORTS)}
            />
          </IonList>
        </Restricted>

        
      <IonList inset={true}>
          <Restricted to="view_reference">
            <MenuListButton
              title={t("menu.dataConfiguration")}
              handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)}
            />
          </Restricted>
          { 
          !isMobile && 
          <Restricted to="view_cameras">
            <MenuListButton title={t("menu.cameras")} handleItemClick={() => handleItemClick(ROUTES.CAMERAS)} />
          </Restricted> 
          }
          <Restricted to="view_users">
            <MenuListButton title={t("menu.users")} handleItemClick={() => handleItemClick(ROUTES.USERS)} />
          </Restricted>
          <Restricted to="view_reference">
            <MenuListButton title={t("menu.directories")} handleItemClick={() => handleItemClick(ROUTES.DIRECTORIES)} />
          </Restricted>
      </IonList>
        

        <Restricted to="proccess_qr_code_order_operation">
          <IonList inset={true}>
            <MenuListButton title={t("menu.scanner")} handleItemClick={() => handleItemClick(ROUTES.SCANNER_QR)} />
          </IonList>
        </Restricted>

        <IonList inset={true}>
          <MenuListButton title={t("menu.language")} handleItemClick={() => handleItemClick(ROUTES.LANGUAGE)} />
        </IonList>

      </IonContent>
    </IonPage>
  );
};

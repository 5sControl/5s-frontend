import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "../../api/getUserList";
import { IonList } from "@ionic/react";
import MenuListButton from "../menuListButton/MenuListButton";

export const UserInfo = () => {
    const [cookies, , removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState<any>({});
    const { t } = useTranslation();
  
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

  return (
    <IonList inset={true}>
        <MenuListButton title={user.username} account={true} height="70px" button={false}/>
    </IonList>
  );
};

export default UserInfo;

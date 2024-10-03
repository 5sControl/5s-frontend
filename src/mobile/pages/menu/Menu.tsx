import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import MenuLogo from '../../assets/svg/menu-logo.svg'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Orders, Settings } from '../../assets/svg/SVGcomponent';
import './Menu.scss'
import { Logout } from '../../components/logout/Logout';
import jwtDecode from 'jwt-decode';
import { getUserList } from '../../api/companyRequest';
import { ROUTES } from '../../../shared/constants/routes';

export const Menu = () => {
  const [cookies, , removeCookie] = useCookies(['token']);
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.token){
      const token = jwtDecode<any>(cookies.token.replace('JWT%220', ''));
      getUserList(window.location.hostname, cookies.token).then((response: any) => {
        if (token.user_id && response.data) {
          setUser(response.data.find((user: any) => user.id === token.user_id));
        }
      });
    }
  }, []);

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const logout = () => {
    removeCookie('token');
  }

  return (
    <IonContent color="light">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img src={MenuLogo}/>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonList inset={true}>
        <IonItem button onClick={() => handleItemClick(ROUTES.ORDERSVIEW)}>
          <IonIcon aria-hidden="true" icon={Settings} slot="start"></IonIcon>
          <IonLabel>Orders View</IonLabel>
        </IonItem>
        <IonItem button onClick={() => handleItemClick(ROUTES.CONFIGURATION)}>
          <IonIcon aria-hidden="true" icon={Orders} slot="start"></IonIcon>
          <IonLabel>Configuration</IonLabel>
         </IonItem>
        </IonList>
        { user && <Logout username={user.username} status={user.status} logout={logout}/> }
      </IonContent>
      );
}

import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Orders, Settings,  MenuLogo } from '../../assets/svg/SVGcomponent';
import './Menu.scss'
import { Logout } from '../../components/logout/Logout';
import jwtDecode from 'jwt-decode';
import { getUserList } from '../../api/companyRequest';
import { ROUTES } from '../../../shared/constants/routes';
import { Header } from '../../components/header/Header';
import { ItemButton } from '../../components/itemButton/ItemButton';

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
      <Header title={<img src={MenuLogo} />} />
      <IonList inset={true}>
        <ItemButton label="Orders View" icon={Settings} handleItemClick={() => handleItemClick(ROUTES.ORDERSVIEW)} />
        <ItemButton label="Configuration" icon={Orders} handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)} />
      </IonList>
        { user && <Logout username={user.username} status={user.status} logout={logout}/> }
      </IonContent>
      );
}

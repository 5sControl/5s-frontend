import React, { ReactNode } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonSearchbar,
  IonIcon,
  useIonViewWillLeave,
  IonButton,
} from "@ionic/react";
import "./Header.scss";
import { useNavigate } from "react-router-dom";
import { Back } from "../../assets/svg/SVGcomponent";

type HeaderProps = {
  title: ReactNode;
  backButtonHref?: string;
  endButton?: ReactNode;
  searchBar?: boolean;
  settings?: string;
  isEdit?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ title, backButtonHref, endButton, searchBar, settings, isEdit }) => {
  const navigate = useNavigate();

  const handleBackButton = (backTo: string) => {
    navigate(backTo);
  };

  return (
    <IonHeader className={searchBar ? "" : "ion-no-border"}>
      <IonToolbar>
        {backButtonHref && (
          <IonButtons slot="start" className="header__start">
            {/* <IonBackButton defaultHref={backButtonHref} text="" color="medium"></IonBackButton> */}
            <IonButton onClick={() => handleBackButton(backButtonHref)}>
              <IonIcon style={{ fontSize: "18px" }} icon={Back} />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle className="header__title">{title}</IonTitle>
        {settings && <IonIcon icon={settings} />}
        <IonButtons slot="end" className="header__end">
          {endButton}
        </IonButtons>
      </IonToolbar>
      {searchBar && <IonSearchbar placeholder="Search" />}
    </IonHeader>
  );
};

import React, { ReactNode } from "react";
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSearchbar, IonIcon } from "@ionic/react";
import "./Header.scss";

type HeaderProps = {
  title: ReactNode;
  backButtonHref?: string;
  endButton?: ReactNode;
  searchBar?: boolean;
  settings?: string;
};

export const Header: React.FC<HeaderProps> = ({ title, backButtonHref, endButton, searchBar, settings }) => {
  return (
    <IonHeader className={searchBar ? "" : "ion-no-border"}>
      <IonToolbar>
        {backButtonHref && (
          <IonButtons slot="start" className="header__start">
            <IonBackButton text="" defaultHref={backButtonHref} color="medium"></IonBackButton>
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

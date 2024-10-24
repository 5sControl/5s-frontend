import React, { ReactNode } from "react";

import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSearchbar, IonButton, IonIcon } from "@ionic/react";
import { useNavigate } from 'react-router-dom';
import { Back } from "../../assets/svg/SVGcomponent";

type HeaderProps = {
    title: ReactNode;
    backButtonHref?: string;
    endButton?: ReactNode;
    searchBar?: boolean;
    searchText?: string;
    onSearchChange?: (v: string) => void
    onBackClick?: () => void
    settings?: string;
}
interface ICustomBack {
    onBackClick?: () => void
    backButtonHref?: string
}


export const Header: React.FC<HeaderProps> = ({ title, backButtonHref, endButton, searchBar, searchText, onSearchChange, settings, onBackClick }) => {
    const navigate = useNavigate();

    const handleBackButton = (backTo: string) => {
      navigate(backTo);
    };
    const backHandler = () => {
        onBackClick ? onBackClick() : navigate(backButtonHref || '')
    }
    return (
        <IonHeader className={searchBar ? "" : "ion-no-border"}>
            <IonToolbar>
                {backButtonHref &&
                    <IonButtons slot="start" className="header__start">

                        <IonButton onClick={backHandler}>

                            <IonIcon style={{ fontSize: "18px" }} icon={Back} />
                        </IonButton>                    

                    </IonButtons>
                }
                <IonTitle className="header__title">{title}</IonTitle>
                {settings && <IonIcon icon={settings} />}
                {endButton && <IonButtons slot="end" className="header__end">{endButton}</IonButtons>}
            </IonToolbar>
            {searchBar && <IonToolbar>
                <IonSearchbar placeholder="Search" debounce={300} value={searchText} onIonInput={(e) => onSearchChange && onSearchChange(e.detail.value!)} />
            </IonToolbar>}
        </IonHeader>
    );
};


import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {IonButton, IonContent, IonList} from "@ionic/react";
import jwtDecode from "jwt-decode";
import {getUserInfo} from "../../api/getUserList";
import {ROUTES} from "../../../shared/constants/routes";
import {Header} from "../../components/header/Header";
import {ItemButton} from "../../components/itemButton/ItemButton";
import {MenuLogo, Orders, Settings} from "../../assets/svg/SVGcomponent";
import {useTranslation} from 'react-i18next';
import {getGuides} from "../../api/guides";
const MOCK = [{id: 1, name: 'guide1'},{id: 2, name: 'guide2'}]



export const Guides: React.FC = () => {
    const [cookies, , removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState<any>({})
    const [guides, setGuides] = useState(MOCK)
    const navigate = useNavigate();
    const { t} = useTranslation();



    useEffect(() => {
        if (cookies.token) {
            const token = jwtDecode<any>(cookies.token.replace("JWT%220", ""));
            getGuides(cookies.token)
                .then((response: any) => {
                    if (response.data) {
                        setGuides(response.data);
                    }
                })
                .catch((error: any) => {
                    console.error('Error fetching user list:', error);
                });
        }
    }, []);


    const handleItemClick = (path: string) => {
        navigate(path);
    };
   const guidesList = guides.map(guide => <ItemButton key={guide.id} label={guide.name}/>)



    return (
        <IonContent color="light">
            <Header title={<img src={MenuLogo} alt="Menu Logo" />}/>
            <ItemButton label="User Account Settings"  handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)} />
            <IonList inset={true}>
                <ItemButton label={"Orders"} icon={Orders} handleItemClick={() => handleItemClick(ROUTES.CONFIGURATION)} />
                {guidesList}
            </IonList>
            <IonButton expand="block" onClick={() => handleItemClick(ROUTES.CONFIGURATION)}>+</IonButton>
        </IonContent>
    );
};

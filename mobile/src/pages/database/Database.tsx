import React from "react";
import {IonContent, IonList, IonPage} from "@ionic/react";
import {useHistory} from "react-router-dom";
import { ROUTES } from "../../shared/constants/routes";
import {databaseTables} from "../../shared/constants/databaseTables";
import {Header} from "../../components/header/Header";
import {ItemButton} from "../../components/itemButton/ItemButton";
import {useTranslation} from "react-i18next";

const Database: React.FC = () => {
    const history =useHistory();
    const {t} = useTranslation();
    const handleItemClick = (path: string) => {
        history.push(path);
    };

    return (
        <IonPage>
            <IonContent>
                <Header title={t('text.database')} backButtonHref={ROUTES.CONNECTIONS}/>
                <IonList inset={true}>
                    {Object.values(databaseTables).map((table) => (
                        table.pageDisplay &&
                        <ItemButton key={table.buttonTitle} disabled={table.disabled} label={t(table.buttonTitle)}
                                    handleItemClick={() => handleItemClick(ROUTES.DATABASE_CATEGORY(table.path))}/>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Database;

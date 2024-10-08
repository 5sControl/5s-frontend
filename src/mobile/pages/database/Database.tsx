import React from "react";
import { IonContent, IonList } from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { databaseTables } from "../../../shared/constants/databaseTables";
import { Header } from "../../components/header/Header";
import { ItemButton } from "../../components/itemButton/ItemButton";

const Database: React.FC = () => {
  const navigate = useNavigate();

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <IonContent>
      <Header title="Database" backButtonHref={ROUTES.CONNECTIONS} />
      <IonList inset={true}>
        {Object.values(databaseTables).map((table) => (
        table.pageDisplay && 
        <ItemButton key={table.buttonTitle} disabled={table.disabled} label={table.buttonTitle} handleItemClick={() => handleItemClick(ROUTES.DATABASE_CATEGORY(table.path))} />
        ))}
      </IonList>
    </IonContent>
  );
};

export default Database;
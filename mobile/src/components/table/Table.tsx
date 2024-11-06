import { IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import { t } from "i18next";
import React from "react";
import "./../../styles/common.scss";
import ItemList from "../itemList/itemList";
import { TableCol, TableRow } from "../../models/interfaces/table.interface";

type TableProps = {
  label: string;
  cols: TableCol[];
  rows?: TableRow[];
};

export const Table: React.FC<TableProps> = ({ label, cols, rows }) => {
  return (
    <>
      <IonList className="ion-padding">
        <IonLabel className="text-bold">{label}</IonLabel>
        <IonItem style={{ marginTop: ".5rem" }}>
          <IonGrid>
            <IonRow class="text-bold">
              {cols.map((col, index) => (
                <IonCol key={col.label + index} size={col.size.toString()}>
                  {col.label}
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonItem>
        {rows?.map((item, index) => (
          <ItemList to={item.navigateTo} key={item.id} navigationAllowed={item.navigationAllowed}>
            <IonGrid>
              <IonRow>
                {cols.map((col, index) => (
                  <IonCol
                    key={`${item.id}${col.label}`}
                    size={col.size.toString()}
                    style={{ justifyItems: "center" }}
                  >
                    {item.values[index]}
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </ItemList>
        ))}
      </IonList>
    </>
  );
};

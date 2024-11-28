import { IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import React from "react";
import ItemList from "../itemList/itemList";
import { TableCol, TableRow } from "../../models/interfaces/table.interface";
import styles from "./table.module.css";

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
        <IonItem className={styles.tableTitle}>
          <IonGrid>
            <IonRow className="text-bold">
              {cols.map((col, index) => (
                <IonCol key={col.label + index} size={col.size.toString()}>
                  <span className="text-nowrap">{col.label}</span>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonItem>
        {rows?.map((item, index) => (
          <ItemList to={item.navigateTo} key={item.id} navigationAllowed={item.navigationAllowed}>
            <IonGrid>
              <IonRow className={styles.valueRow}>
                {cols.map((col, index) => (
                  <IonCol key={`${item.id}${col.label}`} size={col.size.toString()} className={styles.valueCol}>
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

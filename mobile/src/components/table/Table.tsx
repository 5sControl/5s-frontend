import { IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow } from "@ionic/react"
import { t } from "i18next"
import React from "react"
import "./../../styles/common.scss"

type TableProps = {
  label: string,
  cols: string[],
  items: React.ReactNode
}

export const Table: React.FC<TableProps> = ({label, cols, items}) => {
    return (
    <IonList className="ion-padding">
      <IonLabel className="text-bold">
        {label}
      </IonLabel>
      <IonItem>
      <IonGrid>
        <IonRow class="text-bold">
          {cols.map((col, index) => 
          <IonCol key={col + index} class="ion-text-center">
            {col}
          </IonCol>)}
        </IonRow>
      </IonGrid>
    </IonItem>
    {items}
  </IonList>
  )
}
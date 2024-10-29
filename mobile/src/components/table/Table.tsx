import { IonCol, IonGrid, IonItem, IonLabel, IonList, IonRow } from "@ionic/react"
import { t } from "i18next"
import React from "react"

type TableProps = {
  cols: string[],
  items: React.ReactNode
}

export const Table: React.FC<TableProps> = ({cols, items}) => {
    return (
    <IonList>
      <IonItem>
      <IonGrid>
        <IonRow>
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
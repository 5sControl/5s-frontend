import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react"
import { DeleteRedIcon } from "../../assets/svg/SVGcomponent";
import React from "react"
import { useTranslation } from "react-i18next";

type DeleteButtonProps = {
    handleDeleteClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({handleDeleteClick}) => {
  const {t} = useTranslation();

  return (
    <IonList inset={true} className="button__wrapper">
      <IonItem onClick={handleDeleteClick}>
        <IonIcon color="danger" aria-hidden="true" icon={DeleteRedIcon} slot="start"></IonIcon>
        <IonLabel color="danger">{t("operations.delete")}</IonLabel>
      </IonItem>
    </IonList>
  )
}

import { IonButton } from "@ionic/react"
import React from "react"
import { capitalize } from "../../utils/capitalize"
import { ROUTES } from "../../../shared/constants/routes"
import "./emptyResultPrompt.scss"
import { useNavigate } from "react-router-dom"
import {useTranslation} from "react-i18next";

type emptyResultPromptProps = {
  itemsCategory: string
  addButton: boolean,
  path: string
}

export const EmptyResultPrompt: React.FC<emptyResultPromptProps> = ({itemsCategory, addButton, path}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const title = `${t('text.no')} ${itemsCategory}`;
  const description = `${capitalize(itemsCategory)} ${t('text.added')}`;
  const singleItemName = itemsCategory.endsWith("s") ? itemsCategory.slice(0, -1) : itemsCategory;

  const handleAddClick = () => {
    navigate(ROUTES.DATABASE_ADD_ENTRY(path));
  }

  return (
    <div className="prompt">
        <div className="prompt__title">{title}</div>
        <div className="prompt__description">{description}</div>
        {addButton && <IonButton fill="clear" onClick={handleAddClick}>{t('operations.add')} {singleItemName}</IonButton>}
    </div>
  )
}

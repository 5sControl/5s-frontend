import { IonButton } from '@ionic/react'
import React from 'react'
import { capitalize } from '../../utils/capitalize'
import { ROUTES } from '../../../../shared/constants'
import './emptyResultPrompt.scss'
import { useNavigate } from 'react-router-dom'

type emptyResultPromptProps = {
  itemsCategory: string
  addButton: boolean,
}

export const EmptyResultPrompt: React.FC<emptyResultPromptProps> = ({itemsCategory, addButton}) => {
  const navigate = useNavigate();
  const title = `No ${itemsCategory}`;
  const description = `${capitalize(itemsCategory)} you've added will appear here.`;
  const singleItemName = itemsCategory.endsWith('s') ? itemsCategory.slice(0, -1) : itemsCategory;

  const handleAddClick = () => {
    navigate(ROUTES.DATABASE_ADD_ENTRY(itemsCategory));
  }

  return (
    <div className="prompt">
        <div className="prompt__title">{title}</div>
        <div className="prompt__description">{description}</div>
        {addButton && <IonButton fill="clear" onClick={handleAddClick}>Add {singleItemName}</IonButton>}
    </div>
  )
}

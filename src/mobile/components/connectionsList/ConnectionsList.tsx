import React from "react";
import {
  IonList,
  IonItem,
  IonLabel
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { ConnectionItem } from "../../models/interfaces/connectionItem.interface";
import { ItemButton } from "../itemButton/ItemButton";
import {useTranslation} from "react-i18next";

type ConnectionsListProps = {
  items: ConnectionItem[];
};

export const ConnectionsList: React.FC<ConnectionsListProps> = ({ items }) => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const handleAddConnection = () => {
    navigate(ROUTES.CONNECTIONS_ADD);
  }

  return (
    <>
      <IonList inset={true}>
          {items.map((item) => (
            <ItemButton
            key={item.erp_system}
            label={item.erp_system}
            note={item.used_in_orders_view ? t('messages.used') : item.is_active ? t('messages.connected') : t('messages.disconnected')}
            handleItemClick={() => navigate(ROUTES.CONNECTIONS_ITEM(item.id.toString()))} />
          ))}
            <IonItem onClick={handleAddConnection}><IonLabel color="primary">{`+ ${t('operations.add')}`}</IonLabel></IonItem>
      </IonList>
    </>
  );
};

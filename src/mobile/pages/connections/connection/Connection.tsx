import React, { useEffect, useState } from "react";
import { IonContent, IonList } from "@ionic/react";
import { useNavigate, useParams } from "react-router-dom";
import { getConnectionsToDatabases } from "../../../api/connections";
import { useCookies } from "react-cookie";
import { ROUTES } from "../../../../shared/constants/routes";
import { DeleteCover, DeleteRedIcon, EditCover, EditOrangeIcon } from "../../../assets/svg/SVGcomponent";
import { capitalize } from "../../../utils/capitalize";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { Preloader } from "../../../../components/preloader";
import { ConnectionItem } from "../../../models/interfaces/connectionItem.interface";
import { Header } from "../../../components/header/Header";
import { ItemButton } from "../../../components/itemButton/ItemButton";
import {useTranslation} from "react-i18next";

const Connection: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { id } = useParams() as { id: string };
  const [currentConnection, setCurrentConnection] = useState<ConnectionItem>();
  const [connected, setConnected] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const {t} = useTranslation();
  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmConfirm = () => {
    setShowConfirmationModal(false);
  };

  useEffect(() => {
    setLoading(true);
    getConnectionsToDatabases("", cookies.token)
      .then(response => {
        response.data.forEach((connection: ConnectionItem) => {
          connection.read_only = connection.erp_system !== "5s_control";
        });
        const connection = response.data.find((connection: ConnectionItem) => connection.id === parseInt(id));
        setCurrentConnection(connection);
        setConnected(connection?.is_active || false);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDatabaseClick = (path: string) => {
    if (connected) {
      navigate(path);
    }
  };

  return (
    <IonContent>
      <Header title={capitalize(currentConnection?.erp_system)} backButtonHref={ROUTES.CONNECTIONS} />
      {loading ? (
        <div className="preloader">
          <Preloader />
        </div>
      ) : (
        <>
          <IonList inset={true}>
            <ItemButton label="Status" note={connected ? t('text.usedInOrdersView') : t('connected')} />
            <ItemButton label="Domain" note={currentConnection?.host} />
          </IonList>
          <IonList inset={true}>
            <ItemButton label={`${currentConnection?.erp_system} ${t('text.database')}`} disabled={!connected} handleItemClick={() => handleDatabaseClick(ROUTES.DATABASE)}/>
          </IonList>
          <IonList inset={true}>
            <ItemButton label={t('operations.edit')} labelColor={connected ? "medium" : "primary"} icon={connected ? EditCover : EditOrangeIcon} handleItemClick={() => navigate(ROUTES.CONNECTIONS_EDIT(id))} />
            <ItemButton label={t('operations.disconect')} labelColor={connected ? "medium" : "danger"} icon={connected ? DeleteCover : DeleteRedIcon}/>
          </IonList>
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmConfirm}
            title={t('messages.disconectFromERP')}
            description={t('messages.disconectDescription')}
            confirmText={t('operations.disconect')}
            cancelText={t('operations.cancel')}
          />
        </>
      )}
    </IonContent>
  );
};

export default Connection;

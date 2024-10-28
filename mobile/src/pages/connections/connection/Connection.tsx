import React, { useEffect, useState } from "react";
import { IonContent, IonList, IonPage } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { getConnectionsToDatabases } from "../../../api/connections";
import { useCookies } from "react-cookie";
import { ROUTES } from "../../../shared/constants/routes";
import { DeleteCover, DeleteRedIcon, EditCover, EditOrangeIcon } from "../../../assets/svg/SVGcomponent";
import { capitalize } from "../../../utils/capitalize";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { Preloader } from "../../../components/preloader/preloader";
import { ConnectionItem } from "../../../models/interfaces/connectionItem.interface";
import { Header } from "../../../components/header/Header";
import { ItemButton } from "../../../components/itemButton/ItemButton";
import {useTranslation} from "react-i18next";

const Connection: React.FC = () => {
  const history = useHistory();
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
    getConnectionsToDatabases(cookies.token)
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
      history.push(path);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <Header title={capitalize(currentConnection?.erp_system)} backButtonHref={ROUTES.CONNECTIONS} />
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <IonList inset={true}>
              <ItemButton label={t('newConnection.status')} note={connected ? t('text.usedInOrdersView') : t('text.connected')} />
              <ItemButton label={t('newConnection.domain')} note={currentConnection?.host} />
            </IonList>
            <IonList inset={true}>
              <ItemButton label={`${currentConnection?.erp_system} ${t('text.database')}`} disabled={!connected} handleItemClick={() => handleDatabaseClick(ROUTES.DATABASE)}/>
            </IonList>
            <IonList inset={true}>
              <ItemButton label={t('operations.edit')} labelColor={connected ? "medium" : "primary"} icon={connected ? EditCover : EditOrangeIcon} handleItemClick={() => history.push(ROUTES.CONNECTIONS_EDIT(id))} />
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
    </IonPage>
  );
};

export default Connection;

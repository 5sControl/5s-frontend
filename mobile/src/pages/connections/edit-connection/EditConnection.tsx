import React, { useEffect, useRef, useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import { useCookies } from "react-cookie";
import { getConnectionsToDatabases } from "../../../api/connections";
import { capitalize } from "../../../utils/capitalize";
import { Input } from "../../../components/input/Input";
import { ConnectionItem } from "../../../models/interfaces/connectionItem.interface";
import { ROUTES } from "../../../shared/constants/routes";
import {useTranslation} from "react-i18next";

const EditConnection: React.FC = () => {
  const [cookies] = useCookies(["token"]);
  const { id } = useParams() as { id: string };
  const [currentConnection, setCurrentConnection] = useState<ConnectionItem | undefined>(undefined);
  const [changed, setChanged] = useState<boolean>(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [errorPopoverOpen, setErrorPopoverOpen] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    getConnectionsToDatabases(cookies.token)
      .then(response => {
        const connection = response.data.find((connection: ConnectionItem) => connection.id === parseInt(id));
        setCurrentConnection(connection);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id, cookies.token]);

  const handleSaveClick = (e: React.MouseEvent) => {
    if (popover.current) {
      popover.current.event = e;
      setErrorPopoverOpen(true);
    }
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium" />
          </IonButtons>
          <IonTitle>{capitalize(currentConnection?.erp_system || "")} {t('text.connection')}</IonTitle>
          <IonButton slot="end" size="small" color="primary" disabled={!changed} onClick={handleSaveClick}>{t('operations.save')}</IonButton>
          <IonPopover ref={popover} isOpen={errorPopoverOpen} onDidDismiss={() => setErrorPopoverOpen(false)}>
            <IonContent className="ion-padding">{t('messages.unableToSave')}</IonContent>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <Input label={t('newConnection.domain')} value={currentConnection?.host || ""} required handleChange={() => setChanged(true)} />
      <Input label={t('newConnection.name')} value={currentConnection?.erp_system || ""} required handleChange={() => setChanged(true)} />
    </IonContent>
  );
};

export default EditConnection;

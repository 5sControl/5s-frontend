import React, { useRef, useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPopover, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { ROUTES } from "../../../shared/constants/routes";
import { Input } from "../../../components/input/Input";
import {useTranslation} from "react-i18next";

const NewDatabaseEntry: React.FC = () => {
  const [erpSystem, setErpSystem] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [errorPopoverOpen, setErrorPopoverOpen] = useState<boolean>(false);
  const {t} = useTranslation();
  const handleInputChange = () => {
    if (erpSystem && domain && name && password) {
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
  };

  const openErrorPopover = (e: React.MouseEvent) => {
    if (popover.current) {
      popover.current.event = e;
      setErrorPopoverOpen(true);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    openErrorPopover(e);
  };

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium" />
          </IonButtons>
          <IonTitle>{t('newConnection.title')}</IonTitle>
          <IonButton slot="end" size="small" color="primary" disabled={!saveEnabled} onClick={handleSaveClick}>{t('operations.save')}</IonButton>
          <IonPopover ref={popover} isOpen={errorPopoverOpen} onDidDismiss={() => setErrorPopoverOpen(false)}>
            <IonContent className="ion-padding">{t('messages.unableToSave')}</IonContent>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <IonItem className="input__field">
        <IonLabel position="stacked">{t('newConnection.system')}</IonLabel>
        <IonSelect value={erpSystem} placeholder={t('text.select')} onIonChange={(e) => { setErpSystem(e.detail.value); handleInputChange(); }} interface="popover">
          <IonSelectOption value="Odoo">Odoo</IonSelectOption>
          <IonSelectOption value="Manifest">Manifest</IonSelectOption>
          <IonSelectOption value="Winkhouse">Winkhouse</IonSelectOption>
        </IonSelect>
      </IonItem>
      <Input label={t('newConnection.domain')} value={domain} required handleChange={(e) => { setDomain(e.target.value); handleInputChange(); }} />
      <Input label={t('newConnection.name')} value={name} required handleChange={(e) => { setName(e.target.value); handleInputChange(); }} />
      <Input type="password" label={t('newConnection.pwd')} value={password} required handleChange={(e) => { setPassword(e.target.value); handleInputChange(); }} />
    </IonContent>
  );
};

export default NewDatabaseEntry;

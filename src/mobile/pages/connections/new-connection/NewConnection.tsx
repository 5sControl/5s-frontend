import React, { useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPopover, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { ROUTES } from '../../../../shared/constants/routes';
import { Input } from '../../../components/input/Input';

const NewDatabaseEntry: React.FC = () => {
  const [erpSystem, setErpSystem] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [errorPopoverOpen, setErrorPopoverOpen] = useState(false);

  const handleInputChange = () => {
    if (erpSystem && domain && name && password) {
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
  };

  const openErrorPopover = (e: any) => {
    popover.current!.event = e;
    setErrorPopoverOpen(true);
  };

  const handleSaveClick = (e: any) => {
    openErrorPopover(e);
  }

  return (
    <IonContent>
      <IonHeader>
          <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium"></IonBackButton>
              </IonButtons>
              <IonTitle>New connection</IonTitle>
              <IonButton slot="end" size="small" color="primary" disabled={!saveEnabled} onClick={handleSaveClick}>Save</IonButton>
              <IonPopover ref={popover} isOpen={errorPopoverOpen} onDidDismiss={() => setErrorPopoverOpen(false)}>
                <IonContent class="ion-padding">Unable to save</IonContent>
              </IonPopover>
          </IonToolbar>
      </IonHeader> 
      <IonItem className='input__field'>
        <IonLabel position="stacked">ERP system</IonLabel>
        <IonSelect value={erpSystem} labelPlacement="stacked" placeholder="Select" onIonChange={(e) => { setErpSystem(e.detail.value); handleInputChange(); }} interface="popover"> 
          <IonSelectOption value="Odoo">Odoo</IonSelectOption>
          <IonSelectOption value="Manifest">Manifest</IonSelectOption>
          <IonSelectOption value="Winkhouse">Winkhouse</IonSelectOption>
        </IonSelect>
      </IonItem>
      <Input label="Domain" value={domain} required={true} handleChange={(e) => { setDomain(e.target.value); handleInputChange(); }}/>
      <Input label="Name" value={name} required={true} handleChange={(e) => { setName(e.target.value); handleInputChange(); }}/>
      <Input type="password" label="Password" value={password} required={true} handleChange={(e) => { setPassword(e.target.value); handleInputChange(); }}/>
    </IonContent>
  );
};

export default NewDatabaseEntry;
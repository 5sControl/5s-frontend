import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import { ROUTES } from '../../../../shared/constants';
import { Input } from '../../../components/input/Input';

const NewDatabaseEntry: React.FC = () => {
  const [erpSystem, setErpSystem] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

  const handleInputChange = () => {
    if (erpSystem && domain && name && password) {
      setSaveEnabled(true);
    } else {
      setSaveEnabled(false);
    }
  };

  return (
    <IonContent>
      <IonHeader>
          <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.CONNECTIONS} color="medium"></IonBackButton>
              </IonButtons>
              <IonTitle>New connection</IonTitle>
              <IonButton slot="end" size="small" color="primary" disabled={!saveEnabled}>Save</IonButton>
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
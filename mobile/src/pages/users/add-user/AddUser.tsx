import { IonPage, IonContent } from '@ionic/react';
import { t } from 'i18next';
import React from 'react';
import { ConfirmationModal } from '../../../components/confirmationModal/confirmationModal';
import { Header } from '../../../components/header/Header';
import { ROUTES } from '../../../shared/constants/routes';
import SingleInputPage from '../../../ui/signleInputPage/SingleInputPage';

const AddUser = () => {
    return (
    <IonPage>
    <Header
      title={t("operations.add")}
      backButtonHref={ROUTES.USERS}
    ></Header>
    <IonContent>
    </IonContent>
  </IonPage>
    );
  };

export default AddUser;
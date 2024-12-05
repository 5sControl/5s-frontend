import { ROUTES } from "../../../shared/constants/routes";
import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../../components/header/Header";


const AddCamera = () => {

  return (
    <IonPage>
      <Header title="" onBackClick={() => {}} backButtonHref={ROUTES.CAMERAS}></Header>
      <IonContent>
      </IonContent>
    </IonPage>
  );
};

export default AddCamera;

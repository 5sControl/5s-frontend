import { IonFab, IonFabButton, IonIcon } from "@ionic/react";

type FabProps = {
  icon: string;
  handleFabClick: () => void;
};

const Fab = ({ icon, handleFabClick }: FabProps) => {
  return (
    <IonFab className="fab-bottom-right">
      <IonFabButton onClick={handleFabClick}>
        <IonIcon icon={icon}></IonIcon>
      </IonFabButton>
    </IonFab>
  );
};
export default Fab;

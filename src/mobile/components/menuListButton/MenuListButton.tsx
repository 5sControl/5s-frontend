import { IonIcon, IonItem, IonLabel, IonTitle } from "@ionic/react";
import { ArrowRight } from "../../assets/svg/SVGcomponent";

type MenuListButtonProps = {
  title: string;
  account?: boolean;
  icon?: string;
  handleItemClick?: () => void;
};

const MenuListButton = ({ title, icon, account, handleItemClick }: MenuListButtonProps) => {
  return (
    <IonItem button onClick={handleItemClick}>
      {icon && <IonIcon icon={icon} />}
      {account ? (
        <IonLabel>
          <b>{title}</b> <p>Account Settings</p>
        </IonLabel>
      ) : (
        <IonLabel>{title}</IonLabel>
      )}
    </IonItem>
  );
};
export default MenuListButton;

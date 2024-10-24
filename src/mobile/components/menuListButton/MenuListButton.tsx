import { IonIcon, IonItem, IonLabel, IonTitle } from "@ionic/react";
import { ArrowRight } from "../../assets/svg/SVGcomponent";
import { useTranslation } from "react-i18next";

type MenuListButtonProps = {
  title: string;
  account?: boolean;
  icon?: string;
  handleItemClick?: () => void;
};

const MenuListButton = ({ title, icon, account, handleItemClick }: MenuListButtonProps) => {
  const { t } = useTranslation();

  return (
    <IonItem button onClick={handleItemClick}>
      {icon && <IonIcon icon={icon} />}
      {account ? (
        <IonLabel>
          <b>{title}</b> <p>{t("menu.accountSettings")}</p>
        </IonLabel>
      ) : (
        <IonLabel>{title}</IonLabel>
      )}
    </IonItem>
  );
};
export default MenuListButton;

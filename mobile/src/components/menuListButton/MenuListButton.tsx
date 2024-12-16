import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type MenuListButtonProps = {
  title: ReactNode;
  button?: boolean;
  account?: boolean;
  note?: string;
  icon?: string;
  height?: string;
  handleItemClick?: () => void;
};

const MenuListButton = ({
  title,
  icon,
  account,
  note,
  height,
  button = true,
  handleItemClick,
}: MenuListButtonProps) => {
  const { t } = useTranslation();
  return (
    <IonItem button={button} onClick={handleItemClick} style={{ "--min-height": height }}>
      {icon && <IonIcon icon={icon} />}
      {account ? (
        <IonLabel className="label__account">
          <b>{title}</b>
          {note && <p>{note}</p>}
        </IonLabel>
      ) : (
        <IonLabel>{title}</IonLabel>
      )}
    </IonItem>
  );
};
export default MenuListButton;

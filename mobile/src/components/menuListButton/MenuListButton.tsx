import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { useTranslation } from "react-i18next";
import styles from "./menuListButton.module.scss"

type MenuListButtonProps = {
  title: string;
  button?: boolean;
  account?: boolean;
  note?: string;
  icon?: string;
  height?: string;
  handleItemClick?: () => void;
  state?: "neutral" | "error";
  errorMessage?: string;
};

const MenuListButton = ({
  title,
  icon,
  account,
  note,
  height,
  button = true,
  handleItemClick,
  state = "neutral",
  errorMessage,
}: MenuListButtonProps) => {
  const { t } = useTranslation();

  const itemContent = (
    <IonItem 
      button={button} 
      onClick={handleItemClick} 
      style={{ "--min-height": height }}
      className={state === "error" ? `${styles.error}` : ``}
    >
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

  return (
    <>
      {state === "error" ? (
        <div>
          {itemContent}
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Render error message */}
        </div>
      ) : (
        itemContent
      )}
    </>
  );
};

export default MenuListButton;
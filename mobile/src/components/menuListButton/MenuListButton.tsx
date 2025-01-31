import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { ReactNode } from "react";
import styles from "./menuListButton.module.scss";

type MenuListButtonProps = {
  title: ReactNode;
  button?: boolean;
  account?: boolean;
  note?: string;
  icon?: string;
  height?: string;
  handleItemClick?: () => void;
  state?: "neutral" | "error";
  errorMessage?: string;
  disabled?: boolean; 
  children?: ReactNode
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
  disabled = false,
  children 
}: MenuListButtonProps) => {
  const itemContent = (
    <IonItem
      button={button && !disabled} 
      onClick={!disabled ? handleItemClick : undefined} 
      style={{ "--min-height": height }}
      className={`${state === "error" ? styles.error : ''} ${disabled ? styles.disabled : ''}`} 
    >
      {icon && <IonIcon icon={icon} />}
      {account ? (
        <IonLabel className="label__account">
          <b>{title}</b>
          {note && <p>{note}</p>}
        </IonLabel>
      ) : (
        <IonLabel style={{padding: "0.5rem"}}>
          {title}
          {children}
        </IonLabel>
      )}
    </IonItem>
  );

  return (
    <>
      {state === "error" ? (
        <div>
          {itemContent}
          {errorMessage && 
          <div className={styles.footer}>
            <p className={styles.errorMessage}>{errorMessage}</p>
          </div>
          }
        </div>
      ) : (
        itemContent
      )}
    </>
  );
};

export default MenuListButton;
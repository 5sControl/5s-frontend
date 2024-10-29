import { IonButton } from "@ionic/react";

type BottomButtonProps = {
  handleClick: () => void;
  disabled?: boolean;
  label: string;
};

const BottomButton = ({ handleClick, disabled, label }: BottomButtonProps) => {
  return (
    <IonButton className="bottom-50" expand="full" id="open-toast" onClick={handleClick} disabled={disabled}>
      {label}
    </IonButton>
  );
};
export default BottomButton;

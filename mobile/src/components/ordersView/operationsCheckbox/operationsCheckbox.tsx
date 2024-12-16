import { IonList, IonItem, IonCheckbox } from "@ionic/react";
import { FiltrationData } from "../../../models/interfaces/filtrationData.interface";

type OperationsCheckboxProps = {
    items: FiltrationData[];
    handleSelectItem: (index: number) => void;
}

export const OperationsCheckbox: React.FC<OperationsCheckboxProps> = ({items, handleSelectItem}) => {
    return (
        <IonList>
          {items.map((item, index) => (
            <IonItem key={index}>
                <IonCheckbox
                className="customCheckbox"
                checked={item.is_active}
                onIonChange={() => handleSelectItem(index)}
                justify="space-between">
                {item.name}
                </IonCheckbox>
            </IonItem>
          ))}
        </IonList>
    );
}
import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonCheckbox,
  IonSearchbar,
} from "@ionic/react";
import { createOperation } from "../../api/product/productOperation";
import { useCookies } from "react-cookie";

type SelectItemsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: string[]) => void;
  allItems: string[];
  categoryId: string;
  previouslySelectedItems: boolean[];
};

export const SelectItemsModal: React.FC<SelectItemsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  allItems,
  previouslySelectedItems,
  categoryId
}) => {
  const [cookies] = useCookies(["token"]);
  const [selectedItems, setSelectedItems] = useState<boolean[]>(previouslySelectedItems);


  const handleSelectItem = (index: number) => {
    const updatedSelection = [...selectedItems];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedItems(updatedSelection);
  };

  const handleConfirmAdd = async () => {
    const newSelectedItems: string[] = allItems.filter((_, index) => selectedItems[index]);
    setSelectedItems([]);
    onClose();
    onConfirm(newSelectedItems);
      try {
        for (const item of newSelectedItems) {
          await createOperation(item, parseInt(categoryId), cookies.token); 
        }
        onConfirm(newSelectedItems); 
      } catch (error) {
        console.error("Error creating operations:", error);
      }
  };

  const handleClose = () => {
    setSelectedItems([]);
    onClose();
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="selectModal">
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" onClick={handleClose} fill="clear" size="small">Cancel</IonButton>
          <IonTitle>Select</IonTitle>
          <IonButton slot="end" onClick={handleConfirmAdd} size="small">Add</IonButton>
        </IonToolbar>
        <IonSearchbar placeholder="Search" />
      </IonHeader>
      <IonContent>
        <IonList>
          {allItems.map((item, index) => (
            <IonItem key={index}>
                <IonCheckbox 
                className="customCheckbox"
                checked={selectedItems[index] || previouslySelectedItems[index]}
                disabled={previouslySelectedItems[index]}
                onIonChange={() => handleSelectItem(index)}
                justify="space-between">
                {item}
                </IonCheckbox>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

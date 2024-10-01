import React, { useEffect } from 'react';
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
  IonLabel,
} from '@ionic/react';
import './styles.module.css';

type SelectItemsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: string[]) => void;
  allItems: string[];
  selectedItems: boolean[];
  setSelectedItems: (selected: boolean[]) => void;
};

export const SelectItemsModal: React.FC<SelectItemsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  allItems,
  selectedItems,
  setSelectedItems,
}) => {

  const handleSelectItem = (index: number) => {
    const updatedSelection = [...selectedItems];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedItems(updatedSelection);
  };

  const handleConfirmAdd = () => {
    const newSelectedItems: string[] = allItems.filter((_, index) => selectedItems[index]);
    onConfirm(newSelectedItems);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" onClick={onClose} fill="clear" size="small">Cancel</IonButton>
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
                checked={selectedItems[index]}
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

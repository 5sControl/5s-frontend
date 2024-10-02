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
} from '@ionic/react';
import { createOperation } from '../../api/product/productOperation';
import { useCookies } from 'react-cookie';

type SelectItemsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: string[]) => void;
  allItems: string[];
  categoryId: string;
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
  categoryId
}) => {
  const [cookies] = useCookies(['token']);

  const handleSelectItem = (index: number) => {
    const updatedSelection = [...selectedItems];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedItems(updatedSelection);
  };

  const handleConfirmAdd = async () => {
    const newSelectedItems: string[] = allItems.filter((_, index) => selectedItems[index]);
    onConfirm(newSelectedItems);
      try {
        for (const item of newSelectedItems) {
          await createOperation(item, parseInt(categoryId), cookies.token); 
        }
        onConfirm(newSelectedItems); 
        onClose(); 
      } catch (error) {
        console.error("Error creating operations:", error);
      }
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className='selectModal'>
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

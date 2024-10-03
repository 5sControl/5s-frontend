import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonIcon,
  IonReorderGroup,
  IonReorder,
  IonLoading, 
} from '@ionic/react';
import { DeleteRedIcon } from '../../assets/svg/SVGcomponent';
import { fetchDatabaseParam } from '../../api/fetchDatabaseParam';
import { SelectItemsModal } from '../selectItemsModal/selectItemsModal';
import { useCookies } from 'react-cookie';
import { Preloader } from '../../../components/preloader';
import { getAllOperations } from '../../api/product/productOperation';
import { getAllProductTypeOperations } from '../../api/product/productTypeOperation';

type AddItemListProps = {
  title: string;
  items: string[];
  categoryId: string;
  typeId: string;
};

export const AddItemList: React.FC<AddItemListProps> = ({ title, items, categoryId, typeId }) => {
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies] = useCookies(['token']);

useEffect(() => {
  const updatedSelections = allItems.map(item => currentItems.includes(item));
  setSelectedItems(updatedSelections);
}, [allItems, currentItems]);

  const handleEditToggle = () => {
    if (currentItems.length > 0) {
      setIsEditing((prev) => !prev);
    }
  };

  const handleDelete = (index: number) => {
    setCurrentItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (event: CustomEvent) => {
    const movedOperation = currentItems[event.detail.from];
    const newOperations = [...currentItems];
    newOperations.splice(event.detail.from, 1);
    newOperations.splice(event.detail.to, 0, movedOperation);
    // setOperations(newOperations);
    event.detail.complete();
  };

  const handleOpenModal = async () => {
    setLoading(true); 
    try {
      const data = await fetchDatabaseParam(title.toLowerCase(), cookies.token, 1);  // to change
      const operationNames = data.map((item: { name: string }) => item.name);
      setAllItems(operationNames);
      const productOperations: string[] = [];
      getAllProductTypeOperations(parseInt(typeId), cookies.token)
      .then((response: any) => {
        response.data.forEach((operation: any) => productOperations.push(operation.productOperationName));
        setCurrentItems(productOperations);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLoading(false);
  };

  const handleConfirmAdd = (selectedItems: string[]) => {
    setCurrentItems((prev) => {
      const combinedItems = [...prev, ...selectedItems];
      return Array.from(new Set(combinedItems));
    });
  };

  return (
    <>
      <IonList inset={true}>
        <IonListHeader>
          <IonLabel>
            {title} ({currentItems.length})
          </IonLabel>
          <IonButton onClick={handleEditToggle} color={currentItems.length === 0 && !isEditing ? 'medium' : 'primary'}>
            {isEditing ? 'Done' : 'Edit'}
          </IonButton>
        </IonListHeader>
        <IonReorderGroup disabled={!isEditing} onIonItemReorder={handleReorder}>
          {currentItems.map((item, index) => (
            <IonItem key={index}>
              {isEditing && (
                <IonIcon
                  icon={DeleteRedIcon}
                  color="danger"
                  onClick={() => handleDelete(index)}
                  slot="start"
                />
              )}
              <IonLabel>{item}</IonLabel>
              {isEditing && <IonReorder slot="end" />}
            </IonItem>
          ))}
        </IonReorderGroup>
        {!isEditing && 
          <IonItem className="button__wrapper">
            <IonLabel color='primary' onClick={handleOpenModal} className='add-button'>+ Add</IonLabel>
          </IonItem>
        }
      </IonList>

      <IonLoading isOpen={loading} message={'Loading...'} onClick={handleCloseModal} /> 

      {/* {loading && 
      <div className='preloader'>
        <Preloader />
      </div>} */}

      <SelectItemsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        allItems={allItems}
        previouslySelectedItems={selectedItems}
        categoryId={categoryId}
      />
    </>
  );
};
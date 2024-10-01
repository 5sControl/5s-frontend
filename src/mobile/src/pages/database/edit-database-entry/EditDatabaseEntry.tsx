import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { ConfirmationModal } from '../../../components/confirmationModal/confirmationModal';
import { DeleteButton } from '../../../components/deleteButton/DeleteButton';
import { AddItemList } from '../../../components/addItemList/AddItemList';
import { ROUTES } from '../../../../../shared/constants';
import { deleteProduct, updateProduct } from '../../../api/product/productType';
import { updateProductCategory } from '../../../api/product/productCategories';
import { updateProductTypeOperation } from '../../../api/product/productTypeOperation';
import { deleteOperation, updateOperation } from '../../../api/product/productOperation';
import { useNavigate } from 'react-router-dom';

const EditDatabaseEntry: React.FC = () => {
  const navigate = useNavigate();
  const { category, entry, id } = useParams() as { category: string, entry: string, id: string };
  const decodedEntry = decodeURIComponent(entry);

  const [name, setName] = useState<string>(decodedEntry);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleInputChange = (event: CustomEvent) => {
    setName(event.detail.value);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    switch (category){
      case 'product':
        deleteProduct(parseInt(id));
        break;
      case 'operation':
        deleteOperation(parseInt(id));
    }
    navigate(-1);
  };

  const updateEntry = () => {
    switch (category){
      case 'product':
        updateProduct(parseInt(id), name, 1);
        break;
      case 'operation':
        updateOperation(parseInt(id), name, 1)
    }
    navigate(-1);
  }

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref={ROUTES.DATABASE_CATEGORY(category)} color="medium"></IonBackButton>
          </IonButtons>
          <IonTitle>{name}</IonTitle>
          <IonButton slot="end" size="small" color="primary" disabled={!name} onClick={updateEntry}>Save</IonButton>
        </IonToolbar>
        <IonItem className="input__field">
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput value={name} onIonInput={handleInputChange} className="input__wrapper"></IonInput>
        </IonItem>
        {category === 'products' && <AddItemList title="Operations" items={[]} />}
        <DeleteButton handleDeleteClick={handleDeleteClick} />
      </IonHeader>
      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmDelete}
        title={`Delete ${category.endsWith('s') ? category.slice(0, -1) : category}?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </IonContent>
  );
}

export default EditDatabaseEntry;
import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { AddItemList } from '../../../components/addItemList/AddItemList';
import { ROUTES } from '../../../../shared/constants';
import { createProductCategory } from '../../../api/product/productCategories';
import { createOperation } from '../../../api/product/productOperation';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { createProduct } from '../../../api/product/productType';

const NewDatabaseEntry: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const { category } = useParams() as { category: string };
  const titleCategory = category.endsWith('s') ? category.slice(0, -1) : category;

  const [name, setName] = useState<string>('');

  const handleInputChange = (event: CustomEvent) => {
    setName(event.detail.value);
  };

  const createEntry = () => {
    switch (category){
      case 'productCategories':
        createProductCategory(name, cookies.token);
        navigate(ROUTES.DATABASE_CATEGORY('productCategories'));
        break;
      case 'products':
        createProduct(name, 1, cookies.token);
        navigate(ROUTES.DATABASE_CATEGORY('productCategories'));
        break;
      case 'operations':
        createOperation(name, 1, cookies.token);
        navigate(ROUTES.DATABASE_CATEGORY('operations'));
    }
  }
  
  return (
  <IonContent>
    <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton text="" defaultHref={ROUTES.DATABASE_CATEGORY(category)} color="medium"></IonBackButton>
            </IonButtons>
            <IonTitle>New {titleCategory}</IonTitle>
            <IonButton slot="end" size="small" color="primary" disabled={!name} onClick={createEntry}>Save</IonButton>
        </IonToolbar>
    </IonHeader>
    <IonItem className='input__field'>
      <IonLabel position="stacked">Name</IonLabel>
      <IonInput placeholder="Enter a name" onIonInput={handleInputChange} className="input__wrapper"></IonInput>
    </IonItem>
    {category === 'products' && <AddItemList title="Operations" items={[]}/>}
  </IonContent>
  )
}

export default NewDatabaseEntry;
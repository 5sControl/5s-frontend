import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { AddItemList } from '../../../components/addItemList/AddItemList';
import { ROUTES } from '../../../../shared/constants/routes';
import { createProductCategory } from '../../../api/product/productCategories';
import { createOperation } from '../../../api/product/productOperation';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { createProduct } from '../../../api/product/productType';
import { databaseTables } from '../../../../shared/constants/databaseTables';

const NewDatabaseEntry: React.FC = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const { category } = useParams() as { category: string };
  const [ categoryId, setCategoryId] = useState<string>('');
  const databaseTable = databaseTables[category as keyof typeof databaseTables];

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
        createProduct(name, 1, cookies.token).then((response) => setCategoryId(response.data.id))
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
                <IonBackButton text="" defaultHref={ROUTES.DATABASE_CATEGORY(databaseTable.path)} color="medium"></IonBackButton>
            </IonButtons>
            <IonTitle>New {databaseTable.singularName}</IonTitle>
            <IonButton slot="end" size="small" color="primary" disabled={!name} onClick={createEntry}>Save</IonButton>
        </IonToolbar>
    </IonHeader>
    <IonItem className='input__field'>
      <IonLabel position="stacked">Name</IonLabel>
      <IonInput placeholder="Enter a name" onIonInput={handleInputChange} className="input__wrapper"></IonInput>
    </IonItem>
    {category === databaseTables.products.path && <AddItemList title="Operations" items={[]} categoryId={categoryId} typeId={'-1'}/>}
  </IonContent>
  )
}

export default NewDatabaseEntry;
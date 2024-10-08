import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import { AddItemList } from '../../../components/addItemList/AddItemList';
import { ROUTES } from '../../../../shared/constants/routes';
import { createProductCategory } from '../../../api/product/productCategories';
import { createOperation } from '../../../api/product/productOperation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { createProduct } from '../../../api/product/productType';
import { databaseTables } from '../../../../shared/constants/databaseTables';
import TimePicker from '../../../components/timePickerInput/timePickerInput';
import { Header } from '../../../components/header/Header';

const NewDatabaseEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['token']);
  const { category } = useParams() as { category: string };
  const [ categoryId, setCategoryId] = useState<string>('');
  const { productCategoryId } = location.state || '-1';
  const databaseTable = databaseTables[category as keyof typeof databaseTables];

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); 

  const handleInputChange = (event: CustomEvent) => {
    setName(event.detail.value);
  };

  const createEntry = async () => {
    setLoading(true); 
    try {
      switch (category) {
        case 'productCategories': {
          await createProductCategory(name, cookies.token);
          navigate(ROUTES.DATABASE_CATEGORY('productCategories'));
          break;
        }
        case 'products': {
          const response = await createProduct(name, parseInt(productCategoryId), cookies.token);
          setCategoryId(response.data.id);
          navigate(ROUTES.DATABASE_CATEGORY('productCategories'));
          break;
        }
        case 'operations':{
          await createOperation(name, parseInt(productCategoryId), cookies.token);
          navigate(ROUTES.DATABASE_CATEGORY('operations'));
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error creating entry:', error);

    } finally {
      setLoading(false); 
    }
  };

  return (
    <IonContent>
      <Header title={`New ${databaseTable.singularName}`} backButtonHref={ROUTES.DATABASE_CATEGORY(databaseTable.path)}
        endButton={<IonButton slot="end" size="small" color="primary" disabled={!name || loading} onClick={createEntry}>Save</IonButton>}/>
      {
        <IonLoading isOpen={loading} spinner="circular"> 
        </IonLoading>
      } 
      <IonItem className='input__field'>
        <IonLabel position="stacked">Name</IonLabel>
        <IonInput placeholder="Enter a name" onIonInput={handleInputChange} className="input__wrapper"></IonInput>
      </IonItem>
      {category === databaseTables.products.path && <AddItemList title="Operations" items={[]} categoryId={categoryId} typeId={'-1'} />}
      {category === 'operations' && <TimePicker/>}
    </IonContent>
  );
};

export default NewDatabaseEntry;
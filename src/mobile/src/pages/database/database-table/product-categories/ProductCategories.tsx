import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import DatabaseList from '../../../../components/databaseList/databaseList';
import './../styles.module.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../../../shared/constants';


const ProductCategories: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    const handleSearchInput = (ev: CustomEvent) => {
        setSearchQuery(ev.detail.value);
    };

    return (
        <IonContent>
            <IonHeader className='ion-no-border'>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="" defaultHref={ROUTES.DATABASE} color="medium"></IonBackButton>
                    </IonButtons>
                    <IonTitle className="capitalized">Product categories</IonTitle>
                    <IonButton slot="end" size="small" color="primary" onClick={() => handleItemClick(ROUTES.DATABASE_ADD_ENTRY('productCategories'))}>+ Add</IonButton>
                </IonToolbar>
            </IonHeader>
            <div className="searchContainer">
                <IonSearchbar placeholder={'Search'} onIonInput={handleSearchInput}></IonSearchbar>
            </div>
            <DatabaseList paramName='productCategories' searchQuery={searchQuery} />
        </IonContent>
    )
};

export default ProductCategories;
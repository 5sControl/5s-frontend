import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import DatabaseList from '../../../components/databaseList/databaseList';
import './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes';
import { DatabaseTableInfo } from '../../../models/interfaces/databaseTableInfo.interface';

type DatabaseTableProps = {
    table: DatabaseTableInfo
}

const DatabaseTable: React.FC<DatabaseTableProps> = ({ table }) => {
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
                    <IonTitle className="capitalized">{table.pageTitle}</IonTitle>
                    <IonButton slot="end" size="small" color="primary" onClick={() => handleItemClick(ROUTES.DATABASE_ADD_ENTRY(table.path))}>+ Add</IonButton>
                </IonToolbar>
            </IonHeader>
            <div className="searchContainer">
                <IonSearchbar placeholder={'Search '} onIonInput={handleSearchInput}></IonSearchbar>
            </div>
            <DatabaseList category={table.path} searchQuery={searchQuery} />
        </IonContent>
    )
};

export default DatabaseTable;
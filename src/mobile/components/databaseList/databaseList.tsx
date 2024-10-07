import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { fetchDatabaseParam } from '../../utils/fetchDatabaseParam';
import './styles.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { EmptyResultPrompt } from '../emptyResultPrompt/emptyResultPrompt';
import { useCookies } from 'react-cookie';
import { Preloader } from '../../../components/preloader';
import { databaseTables } from '../../../shared/constants/databaseTables';
import { ItemButton } from '../itemButton/ItemButton';

type DatabaseItem = {
    name: string,
    id: number
};

type DatabaseListProps = {
    category: string;
    searchQuery: string;
    handleItemClick: (category: string, itemName: string, itemId: number) => void;
};

const DatabaseList: React.FC<DatabaseListProps> = ({ category, searchQuery, handleItemClick }) => {
    const [items, setItems] = useState<DatabaseItem[]>([]);
    const [results, setResults] = useState<DatabaseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [ cookies ] = useCookies(['token']);
    const databaseTable = databaseTables[category as keyof typeof databaseTables];
    const location = useLocation(); 
    const { productCategoryId } = location.state || '-1';


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchDatabaseParam(category, cookies.token, productCategoryId);
                setItems(data);
                setResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setItems([]);
            setResults([]);
          };
    }, [category, location]);

    useEffect(() => {
        if (Array.isArray(items) && items.length !== 0)
            setResults(items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery, items]);

    // const handleItemClick = (category: string, itemName: string, itemId: number) => {
    //     const encodedItemName = encodeURIComponent(itemName);
    //     if (category === databaseTables.productCategories.path){
    //         navigate(ROUTES.DATABASE_CATEGORY(databaseTables.products.path));
    //         return;
    //     }
    //     const path = ROUTES.DATABASE_EDIT_ENTRY(category, encodedItemName, itemId.toString());
    //     navigate(path);
    // };

    return (
        <IonContent>
            {loading ? (
                <div className='preloader'>
                    <Preloader/>
                </div>
            ) :
            !Array.isArray(items) || items.length === 0 ?
                <EmptyResultPrompt itemsCategory={databaseTable.singularName} addButton={true}/>
                :
                    <IonList inset={true}>
                    {results.map((item) => (
                        <ItemButton key={item.id} label={item.name} handleItemClick={() => handleItemClick(category, item.name, item.id)} />
                    ))}
                    </IonList>
            }
        </IonContent>
    );
};

export default DatabaseList;
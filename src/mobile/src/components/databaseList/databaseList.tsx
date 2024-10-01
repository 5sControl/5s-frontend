import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { fetchDatabaseParam } from '../../api/fetchDatabaseParam';
import './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants';
import { EmptyResultPrompt } from '../emptyResultPrompt/emptyResultPrompt';
import { getAllProductCategories } from '../../api/product/productCategories';

type DatabaseItem = {
    name: string,
    id: number
};

type DatabaseListProps = {
    paramName: string;
    searchQuery: string;
};

const DatabaseList: React.FC<DatabaseListProps> = ({ paramName, searchQuery }) => {
    const [items, setItems] = useState<DatabaseItem[]>([]);
    const [results, setResults] = useState<DatabaseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchDatabaseParam(paramName);
                setItems(data);
                setResults(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [paramName]);

    useEffect(() => {
        setResults(items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery, items]);

    const handleItemClick = (category: string, itemName: string, itemId: number) => {
        const encodedItemName = encodeURIComponent(itemName);
        if (category === 'productCategories'){
            navigate(ROUTES.DATABASE_CATEGORY('products'));
            return;
        }
        const path = ROUTES.DATABASE_EDIT_ENTRY(category, encodedItemName, itemId.toString());
        navigate(path);
    };

    return (
        <IonContent>
            {loading ? (
                <IonList inset={true}>
                    <IonItem>
                        <IonLabel>Loading items...</IonLabel>
                    </IonItem>
                </IonList>
            ) :
            items.length === 0 ?
                <EmptyResultPrompt itemsCategory={paramName} addButton={true}/>
                :
                    <IonList inset={true}>
                    {results.map((item, index) => (
                        <IonItem key={index} button className="capitalized" onClick={() => handleItemClick(paramName, item.name, item.id)}>
                            <IonLabel>{item.name}</IonLabel>
                        </IonItem>
                    ))}
                    </IonList>
            }
        </IonContent>
    );
};

export default DatabaseList;
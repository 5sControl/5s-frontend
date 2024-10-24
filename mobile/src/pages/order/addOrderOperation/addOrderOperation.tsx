import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonFooter,
    IonItem,
    IonLabel,
    IonList,
    IonLoading, 
    IonPage,
    IonToast,
   
} from '@ionic/react';
import {Header} from "../../../components/header/Header";
import {useLocation, useHistory} from 'react-router-dom';
import {OPERATION_REQUEST, ORDER_REQUEST} from "../../../dispatcher";
import {IProductOperation} from "../../../models/interfaces/operationItem.interface";
import  ModalSave from  "../../../components/modalSave/modalSave";





const addOrderOperation: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [operations, setOperations] = useState<IProductOperation[]>([])
    const [filteredItems, setFilteredItems] = useState<IProductOperation[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const history =useHistory();
    const location = useLocation();
    const name = location.state?.message || '';


    useEffect(() => {
        const filtered = operations.filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchText]);

    useEffect(() => {
        operations.length && setFilteredItems(operations)
    }, [operations]);

    useEffect(() => {
        OPERATION_REQUEST.getOperations(setOperations, setLoading, setToastMessage)
    }, []);
    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };
    const navigateTo = () => {
        history.push('../mobile/orders')
    }

    const handleSubmit = async () => {
        setIsModalOpen(false);
        if(!name){
            setToastMessage('Error with order name, try again')
            return;
        }
        ORDER_REQUEST.addOrder({name, operationIds: selectedIds }, setLoading, setToastMessage, navigateTo )

    };
    const handleSetSearch = (v: string) => setSearchText(v)
    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <IonPage>
            <Header title="Select Operation" backButtonHref="/mobile/order/" searchBar searchText={searchText}
                    onSearchChange={handleSetSearch}/>
            <IonContent className="ion-padding">
                <IonList>
                    {filteredItems.map((item) => (
                        <IonItem key={item.id}>
                            <IonLabel>{item.name}</IonLabel>
                            <IonCheckbox style={{'--border-radius': 'none'}}
                                         slot="end"
                                         onIonChange={(e) => handleCheckboxChange(item.id, e.detail.checked)}
                            />
                        </IonItem>
                    ))}
                </IonList>

                <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage || undefined}
                    duration={3000}
                    onDidDismiss={() => setToastMessage(null)}
                />
            </IonContent>

            <IonFooter style={{paddingBottom: '50px'}} className="ion-padding">
                <IonButton
                    expand="block"
                    onClick={openModal}
                    disabled={selectedIds.length === 0}
                >
                    Save
                </IonButton>
            </IonFooter>

            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} ></ModalSave>           

            <IonLoading isOpen={isLoading} message="Loading..."/>
        </IonPage>
    );
};

export default addOrderOperation;

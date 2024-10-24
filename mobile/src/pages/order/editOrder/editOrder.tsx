import React, {useState, useEffect, useRef} from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonCheckbox, IonButton, IonToast, IonLoading, IonModal, IonFooter, IonButtons, IonText
} from '@ionic/react';
import {Header} from "../../../components/header/Header";
import {ROUTES} from "../../../../shared/constants/routes";
import {useParams, useHistory} from "react-router-dom";
import {IOrders} from "../order";
import {
    IOperation,
    IOrderWithAllOperations,
    IProductOperation
} from "../../../models/interfaces/operationItem.interface";
import styles from './editOrder.module.scss'
import {OPERATION_REQUEST, ORDER_REQUEST} from "../../../dispatcher";
import { log } from 'console';


interface CheckboxItem {
    id: number;
    label: string;
}


const isEquals = (arr1: unknown[], arr2: unknown[]) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
}
const EditOrder: React.FC = () => {
    const history =useHistory();
    const {id} = useParams() as { id: string };
    const [order, setOrder] = useState<IOrderWithAllOperations>({} as IOrderWithAllOperations)
    const [operations, setOperations] = useState<IProductOperation[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const initIds = useRef([] as number[])

    useEffect(() => {
        if (order?.operations) {
            const ids = order.operations.map(item => item.id);
            setSelectedIds(ids)
            if (!initIds.current.length) {
                initIds.current = ids;
            }
        }
    }, [order]);
   console.log(operations)

    useEffect(() => {
        if (!id) return
        ORDER_REQUEST.getOrder(parseInt(id, 10), setOrder, setLoading, setToastMessage)
        OPERATION_REQUEST.getOperations(setOperations, setLoading, setToastMessage)
    }, []);

    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setIsModalOpen(false);
        ORDER_REQUEST.updateOrder(parseInt(id),{...order, operationIds: selectedIds }, setLoading, setToastMessage, handleNavigate )
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
   
    const handleNavigate = () => {
        history.push('/mobile/orders')
    }
    const operationList = operations.map(operation => <IonItem key={operation.id}>
        <IonLabel>{operation.name}</IonLabel>
        <IonCheckbox style={{'--border-radius': 'none'}}
                     slot="end"
                     onIonChange={(e) => handleCheckboxChange(operation.id, e.detail.checked)}
                     checked={selectedIds.includes(operation.id)}
        />
    </IonItem>)
    return (
        <IonPage>
            <Header title={`Edit ${order.name}`} backButtonHref="/mobile/orders"/>
            <IonContent className="ion-padding">
                <IonList className={styles.page}>
                    <IonList className={styles.list}>
                        <IonLabel>Name</IonLabel>
                        <IonText color="medium">
                            {order.name}
                        </IonText>
                    </IonList>
                    <IonList className={styles.list}>
                        <IonLabel>Operations</IonLabel>
                        <IonList>
                            {operationList}
                        </IonList>
                    </IonList>
                </IonList>
            </IonContent>
            <IonFooter style={{paddingBottom: '50px'}} className="ion-padding">
                <IonButton
                    expand="block"
                    onClick={openModal}
                    disabled={isEquals(selectedIds, initIds.current)}
                >
                    Save
                </IonButton>
            </IonFooter>

            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} breakpoints={[0, 0.5]}
                      initialBreakpoint={1}>
                <IonContent className="ion-padding">
                    <IonTitle>Confirm Save</IonTitle>
                    <p>Are you sure you want to save the changes?</p>
                </IonContent>
                <IonFooter>
                    <IonToolbar>
                        <IonButtons slot="end">
                            <IonButton color="danger" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </IonButton>
                            <IonButton onClick={handleSubmit}>Confirm</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            </IonModal>

            <IonLoading isOpen={loading} message="Submitting..."/>
            <IonToast
                    isOpen={!!toastMessage}
                    message={toastMessage || undefined}
                    duration={3000}
                    onDidDismiss={() => setToastMessage(null)}
                />
        </IonPage>
    );
};

export default EditOrder;

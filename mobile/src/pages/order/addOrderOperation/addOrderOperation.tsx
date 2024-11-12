import React, { useEffect, useState } from "react";
import {
  IonCheckbox,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useHistory } from "react-router-dom";
import { OPERATION_REQUEST, ORDER_ITEM_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import ModalSave from "../../../components/modalSave/modalSave";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { IReference } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";
import { IOrderItemAddBody } from "../../../models/interfaces/item.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setOrderItems as setStoreOrderItems,setMaxOrderItemId, setOrderName, setOrderItems, setTempOrderItemId } from "../../../store/orderSlice";

const AddOrderOperation: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [operations, setOperations] = useState<IProductOperation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<IProductOperation[]>([]);
  const [selectedOperations, setSelectedOperations] = useState<{id: number, name: string}[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);
  const storedItems: any = useSelector((state: RootState) => state.order.orderItems);
  const tempItemId: any = useSelector((state: RootState) => state.order.tempOrderItemId);
  const item: any = storedItems[tempItemId];
  const orderName: any = useSelector((state: RootState) => state.order.orderName);

  useEffect(() => {
    const filtered = operations.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredOperations(filtered);
  }, [searchText]);

  useEffect(() => {
    operations.length && setFilteredOperations(operations);
  }, [operations]);

  useIonViewWillEnter(() => {
    OPERATION_REQUEST.getOperations(setOperations, setLoading, setToastMessage);
  });

  const handleCheckboxChange = (id: number, name: string, checked: boolean) => {
    if (checked) {
      setSelectedOperations(prev => [...prev, { id: id, name: name, status: 'pending' }]);
    } else {
      setSelectedOperations(prev => prev.filter(item => item.id !== id));
    }
  };

  const navigateTo = (path: string, state?: any) => {
    history.push(path, state);
    setSelectedOperations([]);
  };

  const handleBackClick = () => {
    setIsModalOpen(false);
    const updatedItems = {...storedItems,  [tempItemId.toString()]: { ...item, operations: storedItems[tempItemId].operations.concat(selectedOperations) }};
    dispatch(setStoreOrderItems(updatedItems));
    navigateTo(ROUTES.ORDER_ADD_ITEM_INFO, { direction: "back" });
  };

  const handleSubmit = async () => {
    const updatedItems = {...storedItems,  [tempItemId.toString()]: { ...item, operations: storedItems[tempItemId].operations.concat(selectedOperations) }};
    console.log('updatedItems', updatedItems);
    dispatch(setStoreOrderItems(updatedItems));
    setIsModalOpen(false);
    navigateTo(ROUTES.ORDER_ADD_ITEM_INFO);
    setLoading(false);
  };

  const handleSetSearch = (v: string) => setSearchText(v);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t("form.selectOrderItem")}
        onBackClick={handleBackClick}
        backButtonHref="#"
        searchBar
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent>
        {isLoading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <IonList className="ion-padding scrollable">
              {filteredOperations.map(item => (
                <IonItem key={item.id}>
                  <IonLabel>{item.name}</IonLabel>
                  <IonCheckbox
                    style={{ "--border-radius": "none" }}
                    slot="end"
                    onIonChange={e => handleCheckboxChange(item.id, item.name, e.detail.checked)}
                    checked={selectedOperations.some(operation => operation.id === item.id)}
                  />
                </IonItem>
              ))}
            </IonList>

            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} />
            <BottomButton
              handleClick={openModal}
              label={t("operations.save")}
              disabled={selectedOperations.length === 0}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddOrderOperation;

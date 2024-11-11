import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { ITEM_REQUEST, OPERATION_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { IProductOperation } from "../../../models/interfaces/operationItem.interface";
import ModalSave from "../../../components/modalSave/modalSave";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import { IReference } from "../../../models/interfaces/orders.interface";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { Preloader } from "../../../components/preloader/preloader";
import { IItem } from "../../../models/interfaces/item.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setOrderItems as setStoreOrderItems,setMaxOrderItemId } from "../../../store/orderSlice";
import { id } from "date-fns/locale";

const AddOrderItem: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [orderItems, setOrderItems] = useState<IItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{id: number, name: string, suffix: string}[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);
  const storedItems: any = useSelector((state: RootState) => state.order.orderItems);
  const tempItemId: any = useSelector((state: RootState) => state.order.tempOrderItemId);
  const initialSuffix  = storedItems[tempItemId]?.suffix || '';

  useEffect(() => {
    const filtered = orderItems.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    orderItems.length && setFilteredItems(orderItems);
  }, [orderItems]);

  useIonViewWillEnter(() => {
    ITEM_REQUEST.getItems(setOrderItems, setLoading, setToastMessage);
  });

  const handleCheckboxChange = (id: number, name: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([]);
    }
    setSelectedItems([{id: id, name: name, suffix: initialSuffix}]);
  };

  const navigateTo = (path: string, state: any) => {
    saveItems();
    history.push(path, state);
  };

  const saveItems = async () => {
    setIsModalOpen(false);
    const updatedItems = {...storedItems,  [tempItemId.toString()]: {id: tempItemId, name: selectedItems[0].name, suffix: initialSuffix, operations: [] }};
    dispatch(setStoreOrderItems(updatedItems));
    dispatch(setMaxOrderItemId(parseInt(tempItemId) + 1));
  };

  const handleSetSearch = (v: string) => setSearchText(v);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t("form.selectOrderItem")}
        onBackClick={() => navigateTo(ROUTES.ORDER_ADD, { direction: "back" })}
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
            <IonList className="ion-padding">
              {filteredItems.map(item => (
                <IonItem key={item.id}>
                  <IonLabel>{item.name}</IonLabel>
                  <IonCheckbox
                    style={{ "--border-radius": "none" }}
                    slot="end"
                    onIonChange={e => handleCheckboxChange(item.id, item.name, e.detail.checked)}
                    checked={selectedItems.length > 0 && selectedItems[0].id === item.id}
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
            <ModalSave isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleSubmit={() => navigateTo(ROUTES.ORDER_ADD_ITEM_INFO, { direction: "forward" })} />
            <BottomButton
              handleClick={openModal}
              label={t("operations.save")}
              disabled={selectedItems.length === 0}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddOrderItem;

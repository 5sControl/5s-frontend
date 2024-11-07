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
import { useLocation, useHistory } from "react-router-dom";
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

const AddOrderItem: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const location = useLocation();
  const state = (location.state as any)?.state;
  const name = state?.message || "";
  const [searchText, setSearchText] = useState<string>("");
  const [orderItems, setOrderItems] = useState<IItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ id: number; name: string }[]>(
    state?.selectedItems || []
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [operationReferences, setOperationReferences] = useState<IReference[]>([]);

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
      setSelectedItems(prev => [...prev, { id: id, name: name }]);
    } else {
      setSelectedItems(prev => prev.filter(item => item.id !== id));
    }
  };
  const navigateTo = () => {
    history.push(ROUTES.ORDER_ADD, { state: { selectedItems: selectedItems, message: name }, direction: "back" });
  };

  const handleSubmit = async () => {
    setIsModalOpen(false);
    if (!name) {
      setToastMessage(t("messages.orderName"));
      return;
    }
    const selectedIds = selectedItems.map(item => item.id);
    navigateTo();
   // ITEM_REQUEST.addItem({ name, operationIds: selectedIds }, setLoading, setToastMessage, navigateTo);
  };
  const handleSetSearch = (v: string) => setSearchText(v);
  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <IonPage>
      <Header
        title={t("form.selectOperation")}
        onBackClick={navigateTo}
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
                    checked={selectedItems.some(operation => operation.id === item.id)}
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
              label={t("orderItems.save")}
              disabled={selectedItems.length === 0}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddOrderItem;

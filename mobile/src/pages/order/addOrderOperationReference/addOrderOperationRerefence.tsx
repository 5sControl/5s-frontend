import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToast,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ModalSave from "../../../components/modalSave/modalSave";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { IReference } from "../../../models/interfaces/orders.interface";
import { OPERATION_REQUEST, ORDER_REQUEST } from "../../../dispatcher";
import { TOAST_DELAY } from "../../../constants/toastDelay";
import "./addOrderOperationReference.scss";
import BottomButton from "../../../components/bottomButton/BottomButton";
import { IOrderOperation } from "../../../models/interfaces/operationItem.interface";
import { Preloader } from "../../../components/preloader/preloader";

const AddOrderOperationReference: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { id, operationId, refId } = useParams<{ id: string; operationId: string; refId: string }>();
  const location = useLocation();
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [references, setReferences] = useState<IReference[]>([]);
  const [operation, setOperation] = useState<IOrderOperation>({} as IOrderOperation);
  const [filteredItems, setFilteredItems] = useState<IReference[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const filtered = references.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    references.length && setFilteredItems(references);
  }, [references]);

  useIonViewWillEnter(() => {
    // TODO
    // OPERATION_REQUEST.getOperationReferenceItems(parseInt(refId), setReferences, setLoading, setToastMessage);
    // ORDER_REQUEST.getOrderOperations(parseInt(operationId), setOperation, setLoading, setToastMessage);
  });

  const navigateTo = () => {
    // history.push(ROUTES.ORDER_OPERATION(id, operationId), { direction: "back" });
    // TODO
  };

  const handleSubmit = async () => {
    // TODO
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <IonPage color="light">
      <Header
        title={t("operations.add")}
        // backButtonHref={ROUTES.ORDER_OPERATION(id, operationId)}
        searchBar={true}
        searchText={searchText}
        onSearchChange={setSearchText}
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
                  <IonCheckbox
                    className="reference-item"
                    justify="space-between"
                    onIonChange={e => handleCheckboxChange(item.id, e.detail.checked)}
                    checked={
                      (operation.extensions?.find(ref => ref.name === item.name) === undefined ? false : true) ||
                      selectedIds.includes(item.id)
                    }
                  >
                    {item.name}
                  </IonCheckbox>
                </IonItem>
              ))}
            </IonList>
            <BottomButton handleClick={openModal} disabled={selectedIds.length === 0} label={t("operations.save")} />
            <IonToast
              isOpen={!!toastMessage}
              message={toastMessage || undefined}
              duration={TOAST_DELAY}
              onDidDismiss={() => setToastMessage(null)}
            />

            <ModalSave
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleSubmit={handleSubmit}
            ></ModalSave>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AddOrderOperationReference;

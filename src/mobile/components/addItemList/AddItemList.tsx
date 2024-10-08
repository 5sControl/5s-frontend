import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonReorderGroup,
  IonLoading,
} from "@ionic/react";
import { fetchDatabaseParam } from "../../utils/fetchDatabaseParam";
import { SelectItemsModal } from "../selectItemsModal/selectItemsModal";
import { useCookies } from "react-cookie";
import { getAllProductTypeOperations } from "../../api/product/productTypeOperation";
import { ReorderItem } from "./ReorderItem";

type AddItemListProps = {
  title: string;
  items: string[];
  categoryId: string;
  typeId: string;
};

export const AddItemList: React.FC<AddItemListProps> = ({ title, items, categoryId, typeId }) => {
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]);
  const [statusEditing, setStatusEditing] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDatabaseParam(title.toLowerCase(), cookies.token, 1);
        const operationNames = data.map((item: { name: string }) => item.name);
        setAllItems(operationNames);
        const productOperations: string[] = [];
        const response = await getAllProductTypeOperations(parseInt(typeId), cookies.token);
        response.data.forEach((operation: any) => productOperations.push(operation.productOperationName));
        setCurrentItems(productOperations);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updatedSelections = allItems.map((item) => currentItems.includes(item));
    setSelectedItems(updatedSelections);
  }, [allItems, currentItems]);

  const handleEditToggle = () => {
    if (currentItems.length > 0) {
      setStatusEditing((prev) => !prev);
    }
  };

  const handleDelete = (index: number) => {
    setCurrentItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (event: CustomEvent) => {
    const movedOperation = currentItems[event.detail.from];
    const newOperations = [...currentItems];
    newOperations.splice(event.detail.from, 1);
    newOperations.splice(event.detail.to, 0, movedOperation);
    setCurrentItems(newOperations);
    event.detail.complete();
  };

  const handleOpenModal = async () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLoading(false);
  };

  const handleConfirmAdd = (selectedItems: string[]) => {
    setCurrentItems((prev) => {
      const combinedItems = [...prev, ...selectedItems];
      return Array.from(new Set(combinedItems));
    });
  };

  return (
    <>
      <IonList inset={true}>
        <IonListHeader>
          <IonLabel>
            {title} ({currentItems.length})
          </IonLabel>
          <IonButton
            onClick={handleEditToggle}
            color={currentItems.length === 0 && !statusEditing ? "medium" : "primary"}
          >
            {statusEditing ? "Done" : "Edit"}
          </IonButton>
        </IonListHeader>
        <IonReorderGroup disabled={!statusEditing} onIonItemReorder={handleReorder}>
          {currentItems.map((item, index) => (
            <ReorderItem
              key={index}
              label={item}
              index={index}
              statusEditing={statusEditing}
              handleDelete={handleDelete}
            />
          ))}
        </IonReorderGroup>
        {!statusEditing && (
          <IonItem className="button__wrapper">
            <IonLabel color="primary" onClick={handleOpenModal} className="add-button">
              + Add
            </IonLabel>
          </IonItem>
        )}
      </IonList>

      <IonLoading isOpen={loading} spinner="circular" onClick={handleCloseModal} />

      <SelectItemsModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        allItems={allItems}
        previouslySelectedItems={selectedItems}
        categoryId={categoryId}
      />
    </>
  );
};

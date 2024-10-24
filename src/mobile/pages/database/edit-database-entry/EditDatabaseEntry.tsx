import React, { useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import { ConfirmationModal } from "../../../components/confirmationModal/confirmationModal";
import { DeleteButton } from "../../../components/deleteButton/DeleteButton";
import { AddItemList } from "../../../components/addItemList/AddItemList";
import { ROUTES } from "../../../../shared/constants/routes";
import { deleteProduct, updateProduct } from "../../../api/product/productType";
import { deleteOperation, updateOperation } from "../../../api/product/productOperation";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { databaseTables } from "../../../../shared/constants/databaseTables";
import TimePicker from "../../../components/timePickerInput/timePickerInput";
import {useTranslation} from "react-i18next";

const EditDatabaseEntry: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(["token"]);
    const { category, entry, id } = useParams() as { category: string, entry: string, id: string };
    const decodedEntry = decodeURIComponent(entry);
    const { productCategoryId } = location.state || { productCategoryId: "-1" };
    const databaseTable = databaseTables[category as keyof typeof databaseTables];

    const [name, setName] = useState<string>(decodedEntry);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const {t} = useTranslation();
    const handleInputChange = (event: CustomEvent) => {
        setName(event.detail.value);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        switch (category) {
            case databaseTables.products.path:
                deleteProduct(parseInt(id), cookies.token);
                break;
            case databaseTables.operations.path:
                deleteOperation(parseInt(id), cookies.token);
                break;
        }
        navigate(-1);
    };

    const updateEntry = () => {
        switch (category) {
            case databaseTables.products.path:
                updateProduct(parseInt(id), name, parseInt(productCategoryId), cookies.token);
                break;
            case databaseTables.operations.path:
                updateOperation(parseInt(id), name, parseInt(productCategoryId), cookies.token);
                break;
        }
        navigate(ROUTES.DATABASE_CATEGORY(databaseTable.path), { state: { productCategoryId } });
    }

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="" defaultHref={ROUTES.DATABASE_CATEGORY(databaseTable.path)} color="medium"></IonBackButton>
                    </IonButtons>
                    <IonTitle>{name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton size="small" color="primary" disabled={!name} onClick={updateEntry}>{t('operations.save')}</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem className="input__field">
                    <IonLabel position="stacked">{t('text.name')}</IonLabel>
                    <IonInput value={name} onIonInput={handleInputChange} className="input__wrapper"></IonInput>
                </IonItem>
                {category === databaseTables.products.path && <AddItemList title={t('db.operations.title')} items={[]} typeId={id} categoryId={category} />}
                {category === databaseTables.operations.path && <TimePicker />}
                <DeleteButton handleDeleteClick={handleDeleteClick} />
            </IonContent>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title={`${t('operations.delete')} ${category.endsWith("s") ? category.slice(0, -1) : category}?`}
                confirmText={t('operations.delete')}
                cancelText={t('operations.Cancel')}
            />
        </IonContent>
    );
};

export default EditDatabaseEntry;

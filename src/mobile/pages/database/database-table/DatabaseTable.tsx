import React, { useState } from "react";
import { IonButton, IonContent, IonSearchbar } from "@ionic/react";
import DatabaseList from "../../../components/databaseList/databaseList";
import "./styles.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { DatabaseTableInfo } from "../../../models/interfaces/databaseTableInfo.interface";
import { databaseTables } from "../../../../shared/constants/databaseTables";
import "../../../styles/common.scss";
import { Header } from "../../../components/header/Header";
import {useTranslation} from "react-i18next";

type DatabaseTableProps = {
    table: DatabaseTableInfo;
};

const DatabaseTable: React.FC<DatabaseTableProps> = ({ table }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { productCategoryId } = location.state || { productCategoryId: "-1" };
    const {t} = useTranslation();

    const handleAddClick = (path: string) => {
        navigate(path, { state: { productCategoryId } });
    };

    const handleSearchInput = (ev: CustomEvent) => {
        setSearchQuery(ev.detail.value);
    };

    const handleItemClick = (category: string, itemName: string, itemId: number) => {
        const encodedItemName = encodeURIComponent(itemName);
        if (category === databaseTables.productCategories.path) {
            navigate(ROUTES.DATABASE_CATEGORY(databaseTables.products.path), { state: { productCategoryId: itemId } });
            return;
        }
        const path = ROUTES.DATABASE_EDIT_ENTRY(category, encodedItemName, itemId.toString());
        navigate(path, { state: { productCategoryId: itemId } });
    };

    return (
        <IonContent>
            <Header
                title={t(table.pageTitle)}
                backButtonHref={ROUTES.DATABASE}
                endButton={
                    <IonButton size="small" fill="solid" onClick={() => handleAddClick(ROUTES.DATABASE_ADD_ENTRY(table.path))}>
                        {`+ ${t('operations.add')}`}
                    </IonButton>
                }
            />
            <div className="searchContainer">
                <IonSearchbar placeholder={t('operations.search')} onIonInput={handleSearchInput}></IonSearchbar>
            </div>
            <DatabaseList category={table.path} searchQuery={searchQuery} handleItemClick={handleItemClick} />
        </IonContent>
    );
};

export default DatabaseTable;

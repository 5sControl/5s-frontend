import React, { useEffect, useState } from "react";
import { IonContent, IonList } from "@ionic/react";
import { fetchDatabaseParam } from "../../utils/fetchDatabaseParam";
import "./styles.module.css";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Preloader } from "../../components/preloader/preloader"
import { databaseTables } from "../../shared/constants/databaseTables";
import { ItemButton } from "../itemButton/ItemButton";
import { EmptyResultPrompt } from "../emptyResultPrompt/emptyResultPrompt";
import {useTranslation} from "react-i18next";

type DatabaseItem = {
  name: string;
  id: number;
};

type DatabaseListProps = {
  category: string;
  searchQuery: string;
  handleItemClick: (category: string, itemName: string, itemId: number) => void;
};

const DatabaseList: React.FC<DatabaseListProps> = ({ category, searchQuery, handleItemClick }) => {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [results, setResults] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["token"]);
  const databaseTable = databaseTables[category as keyof typeof databaseTables];
  const location = useLocation();
  const { productCategoryId }: any = location.state || { productCategoryId: "-1" };
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchDatabaseParam(category, cookies.token, productCategoryId);
        setItems(data);
        setResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setItems([]);
      setResults([]);
    };
  }, [category, location, cookies.token, productCategoryId]);

  useEffect(() => {
    if (Array.isArray(items) && items.length !== 0) {
      setResults(items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, items]);

  return (
    <IonContent>
      {loading ? (
        <div className="preloader">
          <Preloader />
        </div>
      ) : !Array.isArray(items) || items.length === 0 ? (
        <EmptyResultPrompt itemsCategory={t(databaseTable.singularName)} addButton={true} path={databaseTable.path} />
      ) : (
        <IonList inset={true}>
          {results.map((item) => (
            <ItemButton key={item.id} label={item.name} handleItemClick={() => handleItemClick(category, item.name, item.id)} />
          ))}
        </IonList>
      )}
    </IonContent>
  );
};

export default DatabaseList;

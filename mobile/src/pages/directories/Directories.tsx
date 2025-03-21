import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { getAllDirectories, getAllStaticDirectories } from "../../api/directory/directory";
import { Preloader } from "../../components/preloader/preloader";
import { Directory } from "../../models/interfaces/directory.interface";

const Directories = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const [staticItems, setStaticItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleSetSearch = (value: string) => setSearchText(value);

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    setSearchText("");
    setLoading(true);

    Promise.all([getAllDirectories(cookies.token), getAllStaticDirectories(cookies.token)])
      .then(([responseDirectories, responseStaticDirectories]) => {
        setItems(responseDirectories.data);
        setStaticItems(responseStaticDirectories.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const filteredStaticItems = useMemo(
    () => staticItems.filter(item => item?.toLowerCase().includes(searchText.toLowerCase())),
    [staticItems, searchText]
  );

  const filteredItems = useMemo(
    () => items.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())),
    [items, searchText]
  );

  return (
    <IonPage>
      <Header
        title={t("menu.directories")}
        backButtonHref={ROUTES.MENU}
        searchBar={Boolean(items?.length)}
        searchPlaceholder={t("operations.directories.search")}
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : items.length === 0 ? (
          <IonList inset={true}>
            <IonItem>{t("messages.noDatabases")}</IonItem>
          </IonList>
        ) : (
          <>
            <IonList inset>
              {filteredStaticItems.map(itemName => (
                <MenuListButton
                  key={itemName}
                  title={t(`directory.${itemName}.title`)}
                  handleItemClick={() => {
                    handleItemClick(ROUTES[itemName.toUpperCase()]);
                  }}
                />
              ))}
            </IonList>
            <IonList inset>
              {filteredItems.map(({ id, name }) => (
                <MenuListButton
                  key={id}
                  title={name}
                  handleItemClick={() => handleItemClick(ROUTES.DIRECTORY_CATEGORY(String(id)))}
                />
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Directories;

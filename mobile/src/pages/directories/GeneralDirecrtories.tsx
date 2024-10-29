import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { Plus } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { getAllDirectories } from "../../api/directory/directory";
import { Preloader } from "../../components/preloader/preloader";
import { Directory } from "../../models/interfaces/directory.interface";

const mockedData = [
  { id: 1, name: "mocked", isProtected: false },
  { id: 2, name: "data", isProtected: false },
];

const GeneralDirectories = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const [filteredItems, setFilteredItems] = useState<Directory[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleSetSearch = (value: string) => setSearchText(value);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    setSearchText("");
    setLoading(true);
    getAllDirectories(cookies.token)
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    const filtered = items.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    items.length && setFilteredItems(items);
  }, [items]);

  // useEffect(() => {
  //   setLoading(true);
  //   getAllDirectories(cookies.token)
  //     .then(response => {
  //       setItems(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [cookies.token]);

  return (
    <IonPage>
      <Header
        title={t("menu.generalDirectories")}
        backButtonHref={ROUTES.CONFIGURATION}
        searchBar={Boolean(items?.length)}
        searchText={searchText}
        onSearchChange={handleSetSearch}
      />
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <>
            <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.DIRECTORIES_ADD)} />
            {items.length === 0 ? (
              <IonList inset={true}>
                <IonItem>{t("messages.noDatabases")}</IonItem>
              </IonList>
            ) : (
              <IonList inset>
                {filteredItems
                  .filter(({ isProtected }) => !isProtected)
                  .map(({ id, name }) => (
                    <MenuListButton
                      key={id}
                      title={name}
                      handleItemClick={() => handleItemClick(ROUTES.DIRECTORIES_ITEM_CARD(String(id)))}
                    />
                  ))}
              </IonList>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default GeneralDirectories;

import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { Plus } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { useHistory } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { Preloader } from "../../components/preloader/preloader";
import { IItem } from "../../models/interfaces/item.interface";
import { getAllItems } from "../../api/items";

const Items = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<IItem[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleSetSearch = (value: string) => setSearchText(value);
  const handleItemClick = (path: string) => history.push(path);

  useIonViewWillEnter(() => {
    setSearchText("");
    setLoading(true);
    getAllItems(cookies.token)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())),
    [items, searchText]
  );

  return (
    <IonPage>
      <Header
        title={t("directory.items.title")}
        backButtonHref={ROUTES.DIRECTORIES}
        searchBar={Boolean(items?.length)}
        searchPlaceholder={t("operations.items.search")}
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
            <Fab icon={Plus} handleFabClick={() => handleItemClick(ROUTES.ITEM_ADD)} />
            {items.length === 0 ? (
              <IonList inset={true}>
                <IonItem>{t("messages.noDatabases")}</IonItem>
              </IonList>
            ) : (
              <IonList inset>
                {filteredItems.map(({ id, name }) => (
                  <MenuListButton
                    key={id}
                    title={name}
                    handleItemClick={() => handleItemClick(ROUTES.ITEM(String(id)))}
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
export default Items;

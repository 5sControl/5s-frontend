import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { Preloader } from "../../components/preloader/preloader";
import { IUser } from "../../models/interfaces/employee.interface";
import { getUserList } from "../../api/users";
import Fab from "../../components/fab/Fab";
import { Plus } from "../../assets/svg/SVGcomponent";

const Users = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<IUser[]>([]);
  const [filteredItems, setFilteredItems] = useState<IUser[]>([]);
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
    getUserList(cookies.token)
      .then(response => response.data)
      .then(users => {
        setItems(users.sort((a: IUser, b: IUser) => {
          const nameA = constructName(a);
          const nameB = constructName(b);
          return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
        }));
      })  
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    const filtered = items.filter(item => {
      const displayedName = constructName(item);
      return displayedName.toLowerCase().includes(searchText.toLowerCase())});
    setFilteredItems(filtered);
  }, [searchText]);

  useEffect(() => {
    items.length && setFilteredItems(items);
  }, [items]);

  const constructName = (user: IUser) => {
    return `${user.last_name} ${user.first_name}`;
  }

  return (
    <IonPage>
      <Header
        title={t("menu.users")}
        backButtonHref={ROUTES.MENU}
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
          <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.USER_ADD)} />
            {items.length === 0 ? (
              <IonList inset={true}>
                <IonItem>{t("messages.noDatabases")}</IonItem>
              </IonList>
            ) : (
              <IonList inset>
                {filteredItems.map((user) => (
                  <MenuListButton
                    key={user.id}
                    title={constructName(user)}
                    handleItemClick={() => handleItemClick(ROUTES.USER(String(user.id)))}
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
export default Users;

import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useMemo, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { Preloader } from "../../components/preloader/preloader";
import { IEmployee } from "../../models/interfaces/employee.interface";
import { getAllEmployees } from "../../api/employees";

const Employees = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<IEmployee[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleSetSearch = (value: string) => setSearchText(value);
  const handleItemClick = (path: string) => history.push(path);

  useIonViewWillEnter(() => {
    setSearchText("");
    setLoading(true);
    getAllEmployees(cookies.token)
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
        title={t("directory.employees.title")}
        backButtonHref={ROUTES.DIRECTORIES}
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
                    handleItemClick={() => handleItemClick(ROUTES.EMPLOYEE(String(id)))}
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
export default Employees;

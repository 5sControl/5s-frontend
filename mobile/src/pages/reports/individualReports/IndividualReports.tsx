import { IonContent, IonItem, IonList, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../shared/constants/routes";
import { Preloader } from "../../../components/preloader/preloader";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { IEmployee } from "../../../models/interfaces/employee.interface";
import { useHistory } from "react-router";
import { getAllEmployees } from "../../../api/employees";
import MenuListButton from "../../../components/menuListButton/MenuListButton";

const IndividualReports = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<IEmployee[]>([]);
  const [filteredItems, setFilteredItems] = useState<IEmployee[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleSetSearch = (value: string) => setSearchText(value);

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    setSearchText("");
    setLoading(true);
    getAllEmployees(cookies.token)
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

  return (
    <IonPage>
      <Header
        title={t("reports.individualReports")}
        backButtonHref={ROUTES.REPORTS}
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
                    handleItemClick={() => handleItemClick(ROUTES.REPORT_EMPLOYEE(String(id)))}
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
export default IndividualReports;

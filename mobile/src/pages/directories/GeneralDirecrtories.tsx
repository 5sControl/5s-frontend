import { IonContent, IonItem, IonList, IonPage } from "@ionic/react";
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
import { Preloader } from "../../components/preloader/preloader"
import { Directory } from "../../models/interfaces/directory.interface";

const mockedData = [
  { id: 1, name: "mocked", isProtected: false },
  { id: 2, name: "data", isProtected: false },
];

const GeneralDirectories = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
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
  }, [cookies.token]);

  return (
    <IonPage>
      <IonContent>
        {/* <Header title={t("menu.generalDirectories")} backButtonHref={ROUTES.CONFIGURATION} /> */}
        <Header title={"Универсальные справочники"} backButtonHref={ROUTES.CONFIGURATION} />
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
                {items
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
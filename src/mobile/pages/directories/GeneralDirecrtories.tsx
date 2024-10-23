import { IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonList } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { Plus } from "../../assets/svg/SVGcomponent";
import Fab from "../../components/fab/Fab";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { getAllDirectories } from "../../api/directory/directory";
import { Preloader } from "../../../components/preloader";
import { Directory } from "../../models/interfaces/directory.interface";

const mockedData = [
  { id: 1, name: "mocked", isProtected: false },
  { id: 2, name: "data", isProtected: false },
];

const GeneralDirectories = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const handleFabClick = (path: string) => {
    navigate(path);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
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

  return loading ? (
    <div className="preloader">
      <Preloader />
    </div>
  ) : (
    <IonContent>
      {/* <Header title={t("menu.generalDirectories")} backButtonHref={ROUTES.CONFIGURATION} /> */}
      <Header title={"Универсальные справочники"} backButtonHref={ROUTES.CONFIGURATION} />
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
    </IonContent>
  );
};
export default GeneralDirectories;

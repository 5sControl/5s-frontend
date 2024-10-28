import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  useIonViewWillEnter,
} from "@ionic/react";
import { Header } from "../../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { Plus } from "../../../assets/svg/SVGcomponent";
import Fab from "../../../components/fab/Fab";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListButton from "../../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { getAllDirectories, getDirectory } from "../../../api/directory/directory";
import { Preloader } from "../../../components/preloader/preloader";
import { Directory } from "../../../models/interfaces/directory.interface";
import { getDirectoryCategory } from "../../../api/directory/directoryCategories";

const DirectoryCategory = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const [catalogTitle, setCatalogTitle] = useState();
  const { t } = useTranslation();
  const history = useHistory();
  const { refId } = useParams() as { refId: string };

  const [loading, setLoading] = useState(true);

  const handleFabClick = (path: string) => {
    history.push(path);
  };

  const handleItemClick = (path: string) => {
    history.push(path);
  };

  useIonViewWillEnter(() => {
    setLoading(true);

    getDirectory(Number(refId), cookies.token)
      .then(response => {
        setCatalogTitle(response.data.name);
      })
      .catch(error => {
        console.error(error);
      });

    getDirectoryCategory(Number(refId), cookies.token)
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

  // useEffect(() => {
  //   setLoading(true);

  //   getDirectory(Number(refId), cookies.token)
  //     .then(response => {
  //       setCatalogTitle(response.data.name);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  //   getDirectoryCategory(Number(refId), cookies.token)
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
      <IonContent>
        <Header title={catalogTitle} backButtonHref={ROUTES.DIRECTORIES} />
        <Fab icon={Plus} handleFabClick={() => handleFabClick(ROUTES.DIRECTORY_CATEGORY_ADD(refId!))} />
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : items.length === 0 ? (
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
                  handleItemClick={() => handleItemClick(ROUTES.DIRECTORY_CATEGORY_CARD(refId, String(id)))}
                />
              ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
export default DirectoryCategory;

import { IonContent, IonItem, IonList, IonPage } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListButton from "../../components/menuListButton/MenuListButton";
import { useCookies } from "react-cookie";
import { getAllDirectories } from "../../api/directory/directory";
import { Preloader } from "../../components/preloader/preloader"
import { Directory } from "../../models/interfaces/directory.interface";

const Directories = () => {
  const [cookies] = useCookies(["token"]);
  const [items, setItems] = useState<Directory[]>([]);
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

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
        <Header title={t("menu.directories")} backButtonHref={ROUTES.MENU} />
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
              {items
                .filter(({ isProtected }) => isProtected)
                .map(({ id, name }) => (
                  <MenuListButton
                    key={id}
                    title={name}
                    handleItemClick={() => handleItemClick(ROUTES.DIRECTORY_CATEGORY(String(id)))}
                  />
                ))}
            </IonList>
            <IonList inset>
              {items
                .filter(({ isProtected }) => !isProtected)
                .map(({ id, name }) => (
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
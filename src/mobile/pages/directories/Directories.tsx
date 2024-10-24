import { IonContent, IonItem, IonList } from "@ionic/react";
import { Header } from "../../components/header/Header";
import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    setLoading(true);
    getAllDirectories(cookies.token)
      .then(response => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cookies.token]);

  return (
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
  );
};
export default Directories;

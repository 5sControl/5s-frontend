import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../shared/constants/routes";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useEffect, useState } from "react";
import { getDirectory, updateDirectory } from "../../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader/preloader";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../../components/header/Header";
import { DirectoryCategory } from "../../../../models/interfaces/directoryCategory.interface";
import { getDirectoryCategory, updateDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { Directory } from "../../../../models/interfaces/directory.interface";

const EditDirectoryCategory = () => {
  const [cookies] = useCookies(["token"]);
  const { refId, id } = useParams() as { refId: string; id: string };
  const [directoryName, setDirectoryName] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useIonViewWillEnter(() => {
    setLoading(true);
    getDirectoryCategory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
        setDirectoryName(currentCatalog.name);
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
  //   getDirectoryCategory(Number(refId), cookies.token)
  //     .then(response => {
  //       const currentCatalog = response.data.find((catalog: Directory) => catalog.id === Number(id));
  //       setDirectoryName(currentCatalog.name);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [cookies.token]);

  const handleSave = () => {
    if (directoryName.trim()) {
      updateDirectoryCategory(Number(id), Number(refId), directoryName.trim(), false, cookies.token)
        .then(() => history.push(ROUTES.DIRECTORY_CATEGORY_CARD(refId, id), { direction: "back" }))
        .catch(error => {
          console.error(error);
        });
      return;
    }
    console.error("empty input");
  };

  const { t } = useTranslation();
  return (
    <IonPage>
      <Header title={t("directory.edit")} backButtonHref={ROUTES.DIRECTORY_CATEGORY_CARD(refId, id)}></Header>
      <IonContent>
        {loading ? (
          <div className="preloader">
            <Preloader />
          </div>
        ) : (
          <SingleInputPage
            backHref={ROUTES.DIRECTORY_CATEGORY_CARD(refId, id)}
            label={t("directory.name")}
            value={directoryName!}
            required
            handleChange={e => {
              setDirectoryName(e.target.value);
            }}
            handleSave={handleSave}
          />
        )}
      </IonContent>
    </IonPage>
  );
};
export default EditDirectoryCategory;

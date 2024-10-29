import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useCookies } from "react-cookie";
import { createDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";
import { Header } from "../../../../components/header/Header";
import { getDirectory } from "../../../../api/directory/directory";

const NewDirectoryCategory = () => {
  const { refId } = useParams() as { refId: string };
  const { t } = useTranslation();
  const history = useHistory();
  const [cookies] = useCookies(["token"]);
  const [headerName, setHeaderName] = useState("");
  const [directoryName, setDirectoryName] = useState("");

  useIonViewWillEnter(() => {
    setDirectoryName("");
    getDirectory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data;
        setHeaderName(currentCatalog.name);
      })
      .catch(error => {
        console.error(error);
      });
  });

  const handleSave = () => {
    if (directoryName) {
      console.log(directoryName);
      createDirectoryCategory(directoryName, Number(refId), false, cookies.token)
        .then(() => history.push(ROUTES.DIRECTORY_CATEGORY(refId!), { direction: "back" }))
        .catch(error => console.log(error));
      return;
    }
    console.error("empty input");
  };

  return (
    <IonPage>
      <Header title={`${t("directory.newEntry")} "${headerName}"`} backButtonHref={ROUTES.DIRECTORY_CATEGORY(refId!)} />
      <IonContent>
        <SingleInputPage
          backHref={ROUTES.DIRECTORY_CATEGORY(refId!)}
          label={t("directory.name")}
          value={directoryName}
          required
          handleChange={e => {
            setDirectoryName(e.target.value);
          }}
          handleSave={handleSave}
        />
      </IonContent>
    </IonPage>
  );
};
export default NewDirectoryCategory;

import { ROUTES } from "../../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useCookies } from "react-cookie";
import { createDirectoryCategory, getDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { IonContent, IonPage } from "@ionic/react";
import { Header } from "../../../../components/header/Header";
import { Directory } from "../../../../models/interfaces/directory.interface";
import { getDirectory } from "../../../../api/directory/directory";

const NewDirectoryCategory = () => {
  const { refId } = useParams() as { refId: string };
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [headerName, setHeaderName] = useState("");
  const [directoryName, setDirectoryName] = useState("");

  useEffect(() => {
    getDirectory(Number(refId), cookies.token)
      .then(response => {
        const currentCatalog = response.data;
        setHeaderName(currentCatalog.name);
      })
      .catch(error => {
        console.error(error);
      });
  }, [cookies.token]);

  const handleSave = () => {
    if (directoryName) {
      console.log(directoryName);
      createDirectoryCategory(directoryName, Number(refId), false, cookies.token)
        .then(() => navigate(ROUTES.DIRECTORY_CATEGORY(refId!)))
        .catch(error => console.log(error));
      return;
    }
    console.error("empty input");
  };

  return (
    <IonPage>
      <IonContent>
        <Header
          title={`${t("directory.newEntry")} "${headerName}"`}
          backButtonHref={ROUTES.DIRECTORY_CATEGORY(refId!)}
        ></Header>
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

import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import { Header } from "../../../components/header/Header";

const NewDirectory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");

  const handleSave = () => {
    if (directoryName.trim()) {
      createDirectory(directoryName.trim(), false, cookies.token)
        .then(() => navigate(ROUTES.GENEREAL_DIRECTORIES))
        .catch(error => console.error(error));
      return;
    }
    console.error("empty input");
  };

  return (
    <IonPage>
      <IonContent>
        <Header title={t("directory.newDirectory")} backButtonHref={ROUTES.GENEREAL_DIRECTORIES}></Header>
        <SingleInputPage
          title={t("directory.newDirectory")}
          backHref={ROUTES.GENEREAL_DIRECTORIES}
          label={t("newConnection.name")}
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
export default NewDirectory;

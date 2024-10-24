import { ROUTES } from "../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { IonContent, IonToast } from "@ionic/react";

const NewDirectory = () => {
  const { t } = useTranslation();
  const history =useHistory();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");

  const handleSave = () => {
    if (directoryName.trim()) {
      createDirectory(directoryName.trim(), false, cookies.token)
        .then(() => history.push(ROUTES.GENEREAL_DIRECTORIES))
        .catch(error => console.error(error));
      return;
    }
    console.error("empty input");
  };

  return (
    <IonContent>
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
  );
};
export default NewDirectory;

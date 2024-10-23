import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleInputPage from "../../../ui/signleInputPage/SingleInputPage";
import { createDirectory } from "../../../api/directory/directory";
import { useCookies } from "react-cookie";
import { Preloader } from "../../../../components/preloader";
import { IonContent, IonToast } from "@ionic/react";

const NewDirectory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = () => {
    if (directoryName.trim()) {
      setLoading(true);
      createDirectory(directoryName.trim(), false, cookies.token)
        .then(() => navigate(ROUTES.GENEREAL_DIRECTORIES))
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
      setToastMessage("Directory Created");
      return;
    }
    setToastMessage("Empty Input");
    console.error("empty input");
  };

  return (
    <IonContent>
      <SingleInputPage
        title={t("directory.newDirectory")}
        backHref={ROUTES.GENEREAL_DIRECTORIES}
        label={t("newConnection.name")}
        value={directoryName}
        toastMessage={toastMessage}
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

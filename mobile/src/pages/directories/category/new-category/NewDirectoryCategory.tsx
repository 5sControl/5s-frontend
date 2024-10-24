import { ROUTES } from "../../../../shared/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SingleInputPage from "../../../../ui/signleInputPage/SingleInputPage";
import { useCookies } from "react-cookie";
import { createDirectoryCategory } from "../../../../api/directory/directoryCategories";
import { IonContent } from "@ionic/react";

const NewDirectoryCategory = () => {
  const { refId } = useParams() as { refId: string };
  const { t } = useTranslation();
  const history =useHistory();
  const [cookies] = useCookies(["token"]);
  const [directoryName, setDirectoryName] = useState("");

  const handleSave = () => {
    if (directoryName) {
      console.log(directoryName);
      createDirectoryCategory(directoryName, Number(refId), false, cookies.token)
        .then(() => history.push(ROUTES.DIRECTORY_CATEGORY(refId!)))
        .catch(error => console.log(error));
      return;
    }
    console.error("empty input");
  };

  return (
    <IonContent>
      <SingleInputPage
        title={t("directory.newDirectory")}
        backHref={ROUTES.DIRECTORY_CATEGORY(refId!)}
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
export default NewDirectoryCategory;
